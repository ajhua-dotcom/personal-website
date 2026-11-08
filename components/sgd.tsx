'use client';

import { useEffect, useRef } from 'react';

// Stochastic gradient descent on a made-up non-convex loss surface, drawn as a line-art
// wireframe. A few runs start high on the surface, swoop downhill (SGD with momentum and
// minibatch-style noise), loop around whichever basin they reach (not always the deepest)
// while the learning rate anneals, settle, fade, and start over somewhere else.
// The surface turns slowly; drag to turn it yourself, and click or tap the surface to
// start a run from that point. Purely decorative.

// Optimizer
const LR = 0.0012; // peak learning rate, cosine-annealed over each run
const LR_FLOOR = 0.04; // share of the peak rate left at the end of a run
const MOMENTUM = 0.96;
const NOISE = 2; // std. dev. of the noise added to each gradient
const STEP_MS = 1000 / 60; // one optimizer step per 60 Hz frame
const RUN_STEPS = 570; // steps before a run starts to fade (9.5 s)
const FADE_STEPS = 60;
const PATH = RUN_STEPS + FADE_STEPS + 1; // positions kept per run: the whole run
const AUTO_RUNS = 4; // runs that keep restarting on their own
const MAX_RUNS = 10; // auto runs plus the visitor's

// Loss surface on [-SPAN, SPAN]²: a shallow bowl, a deep well, a lesser well, a pothole,
// a hill, a ridge between the basins, and a little ripple so no descent is perfectly smooth.
const SPAN = 2.5;
const BOWL = 0.07;
// [x, y, height (negative is a well), width]
const BUMPS: readonly (readonly [number, number, number, number])[] = [
  [1.25, 0.85, -1.35, 0.9], // global minimum
  [-1.35, -0.95, -0.95, 0.65], // local minimum
  [-1.0, 1.45, -0.6, 0.35], // shallow local minimum
  [0.25, -1.55, 0.7, 0.8], // hill
  [-0.1, 0.1, 0.35, 0.5], // ridge
];
const RIPPLE = 0.07;
const RIPPLE_X = 2.6;
const RIPPLE_Y = 2.1;
const LOSS_MID = -0.155; // middle of the loss range, so the drawing centres vertically
const RELIEF = 1.2; // vertical scale of the drawn surface

// Mesh
const GRID = 25; // lines in each direction
const SAMPLES = 61; // points along each line
const CHUNK = 6; // points per stroke, so nearer parts of the mesh can draw brighter
const BUCKETS = 8; // brightness levels the strokes are grouped into
const BANDS = 12; // brightness levels along each run's path

// View: yaw turns the surface about its vertical axis, pitch is the camera's elevation.
const YAW = 0.55;
const PITCH = 0.7;
const PITCH_MIN = 0.15;
const PITCH_MAX = 1.3;
const IDLE_SPIN = 0.00008; // radians per millisecond, about 80 s per turn
const DRAG_RADIANS_PER_PX = 0.01;
const SPIN_FRICTION = 0.94; // share of a flick's extra spin kept per 60 Hz frame
const DISTANCE = 22; // camera distance, for a touch of perspective
const REACH = SPAN * Math.SQRT2; // farthest any point sits from the axis
// The corners stand high on the bowl's rim, which lifts the whole drawing; lower it by as much.

const PICK_RADIUS = 18; // px from a click to the nearest surface point
const TAP_SLOP = 5; // px a click may move before it counts as a drag

function loss(x: number, y: number) {
  let f = BOWL * (x * x + y * y) + RIPPLE * Math.sin(RIPPLE_X * x) * Math.cos(RIPPLE_Y * y);
  for (const [cx, cy, a, w] of BUMPS) f += a * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / w);
  return f;
}

function gradient(x: number, y: number): [number, number] {
  let gx = 2 * BOWL * x + RIPPLE * RIPPLE_X * Math.cos(RIPPLE_X * x) * Math.cos(RIPPLE_Y * y);
  let gy = 2 * BOWL * y - RIPPLE * RIPPLE_Y * Math.sin(RIPPLE_X * x) * Math.sin(RIPPLE_Y * y);
  for (const [cx, cy, a, w] of BUMPS) {
    const e = (a * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / w) * -2) / w;
    gx += e * (x - cx);
    gy += e * (y - cy);
  }
  return [gx, gy];
}

const surfaceZ = (x: number, y: number) => (loss(x, y) - LOSS_MID) * RELIEF;

// The corners stand high on the bowl's rim and lift the whole drawing; it's lowered by as much.
const CORNER_Z = (surfaceZ(SPAN, SPAN) + surfaceZ(SPAN, -SPAN) + surfaceZ(-SPAN, SPAN) + surfaceZ(-SPAN, -SPAN)) / 4;

// Wireframe points: GRID lines along x, then GRID lines along y, SAMPLES points each.
function meshPoints(): Float32Array {
  const pts = new Float32Array(2 * GRID * SAMPLES * 3);
  let o = 0;
  for (let dir = 0; dir < 2; dir++) {
    for (let l = 0; l < GRID; l++) {
      const fixed = -SPAN + (2 * SPAN * l) / (GRID - 1);
      for (let k = 0; k < SAMPLES; k++) {
        const along = -SPAN + (2 * SPAN * k) / (SAMPLES - 1);
        const x = dir === 0 ? along : fixed;
        const y = dir === 0 ? fixed : along;
        pts[o++] = x;
        pts[o++] = y;
        pts[o++] = surfaceZ(x, y);
      }
    }
  }
  return pts;
}

// Deterministic randomness, so the opening runs are the same on every visit.
function makeRandom(seed: number) {
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-12)) * Math.cos(2 * Math.PI * rand());
  return { rand, gauss };
}

type Run = {
  x: number;
  y: number;
  vx: number; // momentum
  vy: number;
  step: number;
  auto: boolean; // restarts by itself, rather than started by a click
  // Every position so far, lifted just above the surface.
  xs: Float32Array;
  ys: Float32Array;
  zs: Float32Array;
  count: number;
};

function record(run: Run) {
  if (run.count >= PATH) return;
  run.xs[run.count] = run.x;
  run.ys[run.count] = run.y;
  run.zs[run.count] = surfaceZ(run.x, run.y) + 0.015;
  run.count++;
}

function newRun(x: number, y: number, auto: boolean): Run {
  const run: Run = {
    x,
    y,
    vx: 0,
    vy: 0,
    step: 0,
    auto,
    xs: new Float32Array(PATH),
    ys: new Float32Array(PATH),
    zs: new Float32Array(PATH),
    count: 0,
  };
  record(run);
  return run;
}

// One step of SGD with momentum. The noise stands in for minibatch sampling; the
// cosine-annealed learning rate lets each run settle instead of rattling forever.
function step(run: Run, gauss: () => number) {
  const t = Math.min(run.step / RUN_STEPS, 1);
  const lr = LR * (LR_FLOOR + (1 - LR_FLOOR) * 0.5 * (1 + Math.cos(Math.PI * t)));
  const [gx, gy] = gradient(run.x, run.y);
  run.vx = MOMENTUM * run.vx + gx + NOISE * gauss();
  run.vy = MOMENTUM * run.vy + gy + NOISE * gauss();
  run.x = Math.max(-SPAN, Math.min(SPAN, run.x - lr * run.vx));
  run.y = Math.max(-SPAN, Math.min(SPAN, run.y - lr * run.vy));
  run.step++;
  record(run);
}

// Fade in over the first few steps, out over the last FADE_STEPS.
const opacity = (run: Run) =>
  run.step < 20
    ? 0.25 + (0.75 * run.step) / 20
    : run.step > RUN_STEPS
      ? Math.max(0, 1 - (run.step - RUN_STEPS) / FADE_STEPS)
      : 1;

export function SgdLandscape({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const root = getComputedStyle(document.documentElement);
    const lineColor = root.getPropertyValue('--text-body').trim() || '#d3d3de';
    const accent = root.getPropertyValue('--accent').trim() || '#aba8ff';
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const { rand, gauss } = makeRandom(11);
    const mesh = meshPoints();
    const meshCount = mesh.length / 3;
    const meshScreen = new Float32Array(meshCount * 2);
    const meshDepth = new Float32Array(meshCount);
    const chunksPerLine = Math.ceil((SAMPLES - 1) / CHUNK);
    const chunkBucket = new Uint8Array(2 * GRID * chunksPerLine);
    const pathScreen = new Float32Array(PATH * 2);

    // Start a run high on the surface: the highest of a few random points.
    const spawn = () => {
      let bx = 0;
      let by = 0;
      let best = -Infinity;
      for (let i = 0; i < 3; i++) {
        const x = (rand() * 2 - 1) * (SPAN - 0.25);
        const y = (rand() * 2 - 1) * (SPAN - 0.25);
        const f = loss(x, y);
        if (f > best) {
          best = f;
          bx = x;
          by = y;
        }
      }
      return newRun(bx, by, true);
    };

    // Stagger the opening runs through their lives so they don't all restart together.
    // With reduced motion, each run is shown whole, start to finish.
    const runs: Run[] = [];
    for (let k = 0; k < AUTO_RUNS; k++) {
      const run = spawn();
      const ahead = still ? RUN_STEPS : 30 + Math.round((k * (RUN_STEPS + FADE_STEPS)) / AUTO_RUNS);
      for (let i = 0; i < ahead; i++) step(run, gauss);
      runs.push(run);
    }

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    let lastTime = 0;
    let pending = 0; // ms of simulation owed
    let yaw = YAW;
    let pitch = PITCH;
    let spin = still ? 0 : IDLE_SPIN; // radians per ms
    let dragging = false;
    let downX = 0;
    let downY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastMove = 0;
    let moved = 0;

    // Projection terms, refreshed each frame.
    let cosYaw = 1;
    let sinYaw = 0;
    let cosPitch = 1;
    let sinPitch = 0;
    let scale = 1;
    let originX = 0;
    let originY = 0;

    const setView = () => {
      cosYaw = Math.cos(yaw);
      sinYaw = Math.sin(yaw);
      cosPitch = Math.cos(pitch);
      sinPitch = Math.sin(pitch);
      // Fit the nearest corner, enlarged by perspective, inside the frame.
      const nearest = DISTANCE / (DISTANCE - REACH * cosPitch);
      scale = (Math.min(width, height) * 0.45) / (REACH * nearest);
      originX = width / 2;
      originY = height / 2 + CORNER_Z * cosPitch * scale;
    };

    // Model (x, y across, z up) to screen; returns depth, larger is farther away.
    const project = (x: number, y: number, z: number, out: Float32Array, o: number) => {
      const across = cosYaw * x - sinYaw * y;
      const away = sinYaw * x + cosYaw * y;
      const up = z * cosPitch + away * sinPitch;
      const depth = away * cosPitch - z * sinPitch;
      const p = DISTANCE / (DISTANCE + depth);
      out[o] = originX + across * scale * p;
      out[o + 1] = originY - up * scale * p;
      return depth;
    };

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawMesh = () => {
      for (let i = 0; i < meshCount; i++) {
        meshDepth[i] = project(mesh[i * 3], mesh[i * 3 + 1], mesh[i * 3 + 2], meshScreen, i * 2);
      }
      // Bucket each stroke by the depth at its middle: near is bright, far is dim.
      for (let line = 0; line < 2 * GRID; line++) {
        for (let c = 0; c < chunksPerLine; c++) {
          const start = line * SAMPLES + c * CHUNK;
          const end = Math.min(start + CHUNK, line * SAMPLES + SAMPLES - 1);
          const near = (REACH - meshDepth[(start + end) >> 1]) / (2 * REACH);
          chunkBucket[line * chunksPerLine + c] = Math.min(BUCKETS - 1, Math.max(0, Math.floor(near * BUCKETS)));
        }
      }
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.7;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'butt';
      for (let b = 0; b < BUCKETS; b++) {
        ctx.globalAlpha = 0.05 + (0.32 * (b + 0.5)) / BUCKETS;
        ctx.beginPath();
        for (let line = 0; line < 2 * GRID; line++) {
          for (let c = 0; c < chunksPerLine; c++) {
            if (chunkBucket[line * chunksPerLine + c] !== b) continue;
            const start = line * SAMPLES + c * CHUNK;
            const end = Math.min(start + CHUNK, line * SAMPLES + SAMPLES - 1);
            ctx.moveTo(meshScreen[start * 2], meshScreen[start * 2 + 1]);
            for (let i = start + 1; i <= end; i++) ctx.lineTo(meshScreen[i * 2], meshScreen[i * 2 + 1]);
          }
        }
        ctx.stroke();
      }
    };

    const drawRun = (run: Run) => {
      const alpha = opacity(run);
      if (alpha <= 0) return;
      const n = run.count;
      for (let i = 0; i < n; i++) project(run.xs[i], run.ys[i], run.zs[i], pathScreen, i * 2);

      // The path, in bands that brighten toward the head; the route down stays faintly visible.
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.4;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      for (let b = 0; b < BANDS; b++) {
        const from = Math.floor((b * (n - 1)) / BANDS);
        const to = Math.floor(((b + 1) * (n - 1)) / BANDS);
        if (to <= from) continue;
        ctx.globalAlpha = (0.18 + 0.82 * ((b + 1) / BANDS) ** 1.5) * 0.9 * alpha;
        ctx.beginPath();
        ctx.moveTo(pathScreen[from * 2], pathScreen[from * 2 + 1]);
        for (let i = from + 1; i <= to; i++) ctx.lineTo(pathScreen[i * 2], pathScreen[i * 2 + 1]);
        ctx.stroke();
      }

      // A ripple where a run you started lands.
      if (!still && !run.auto && run.step < 40) {
        const t = run.step / 40;
        ctx.globalAlpha = (1 - t) * 0.8;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pathScreen[0], pathScreen[1], 3 + t * 16, 0, Math.PI * 2);
        ctx.stroke();
      }

      // The head: where the parameters are now.
      ctx.globalAlpha = alpha;
      ctx.fillStyle = accent;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pathScreen[(n - 1) * 2], pathScreen[(n - 1) * 2 + 1], 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      setView();
      drawMesh();
      for (const run of runs) drawRun(run);
      ctx.globalAlpha = 1;
    };

    const advance = () => {
      for (let i = runs.length - 1; i >= 0; i--) {
        const run = runs[i];
        step(run, gauss);
        if (run.step >= RUN_STEPS + FADE_STEPS) {
          if (run.auto) runs[i] = spawn();
          else runs.splice(i, 1);
        }
      }
    };

    const loop = (time: number) => {
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : STEP_MS;
      lastTime = time;

      if (!dragging) {
        yaw += spin * elapsed;
        // A flick's extra spin fades back to the idle turn.
        spin = IDLE_SPIN + (spin - IDLE_SPIN) * Math.pow(SPIN_FRICTION, elapsed / STEP_MS);
      }
      pending += elapsed;
      while (pending >= STEP_MS) {
        advance();
        pending -= STEP_MS;
      }

      draw();
      frame = visible ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (still) {
        draw();
        return;
      }
      if (!frame && visible && !document.hidden) {
        lastTime = 0;
        frame = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Only animate while on screen and while the tab is visible.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      if (still || !frame) draw();
    });
    ro.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    // Start a run from the surface point nearest the click, taking the front of the
    // surface where front and back overlap on screen.
    const probe = new Float32Array(2);
    const dropAt = (clientX: number, clientY: number) => {
      const box = canvas.getBoundingClientRect();
      const px = clientX - box.left;
      const py = clientY - box.top;
      setView();
      const N = 48;
      let bestDepth = Infinity;
      let bx = 0;
      let by = 0;
      for (let i = 0; i <= N; i++) {
        for (let j = 0; j <= N; j++) {
          const x = -SPAN + (2 * SPAN * i) / N;
          const y = -SPAN + (2 * SPAN * j) / N;
          const depth = project(x, y, surfaceZ(x, y), probe, 0);
          if (depth >= bestDepth || Math.hypot(probe[0] - px, probe[1] - py) > PICK_RADIUS) continue;
          bestDepth = depth;
          bx = x;
          by = y;
        }
      }
      if (bestDepth === Infinity) return;

      // Past the cap, the visitor's oldest run makes way.
      const oldest = runs.findIndex((r) => !r.auto);
      if (runs.length >= MAX_RUNS && oldest >= 0) runs.splice(oldest, 1);
      const run = newRun(bx, by, false);
      if (still) for (let i = 0; i < RUN_STEPS; i++) step(run, gauss);
      runs.push(run);
      if (still) draw();
    };

    // Drag sideways to turn the surface, up and down to look from higher or lower.
    // A click or tap that barely moves starts a run instead.
    const onDown = (e: PointerEvent) => {
      dragging = true;
      spin = 0;
      downX = lastX = e.clientX;
      downY = lastY = e.clientY;
      lastMove = e.timeStamp;
      moved = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dt = Math.max(e.timeStamp - lastMove, 1);
      moved = Math.max(moved, Math.hypot(e.clientX - downX, e.clientY - downY));
      if (moved > TAP_SLOP) {
        yaw += dx * DRAG_RADIANS_PER_PX;
        pitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, pitch + dy * DRAG_RADIANS_PER_PX));
        // Smoothed pointer velocity, carried as spin on release.
        spin = spin * 0.5 + (dx / dt) * DRAG_RADIANS_PER_PX * 0.5;
        if (still) draw();
      }
      lastX = e.clientX;
      lastY = e.clientY;
      lastMove = e.timeStamp;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const tap = moved <= TAP_SLOP;
      // Reduced motion never spins; a drag that stopped before release doesn't fling.
      if (still) spin = 0;
      else if (tap || e.timeStamp - lastMove > 80) spin = IDLE_SPIN;
      if (tap && e.type === 'pointerup') dropAt(e.clientX, e.clientY);
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    resize();
    draw();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <figure className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
      <figcaption translate="no">
        <span>SGD with momentum (β={MOMENTUM})</span>
        <span>drag to rotate · click to start a run</span>
      </figcaption>
    </figure>
  );
}
