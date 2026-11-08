'use client';

import { useEffect, useRef } from 'react';

// The light is a head that sits exactly under the pointer, plus a tail of trailing
// points that each chase the point ahead of them, like a comet. Moving fast stretches
// the tail; stopping folds it back into the head.
const TAIL = 7;
// Share of the gap to the point ahead that each tail point closes per 60 Hz frame.
// Lower makes a longer, lazier tail.
const LINK = 0.45;

// Mouse and trackpad only, and off when the visitor prefers reduced motion.
// Writes CSS variables (--x0/--y0 for the head, --x1… for the tail) from an
// animation-frame loop, never React state.
export function CanvasSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const finePointer = window.matchMedia('(pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || calm.matches) return;

    let origin = el.getBoundingClientRect();
    let frame = 0;
    let last = 0;
    let placed = false;
    const xs = new Float32Array(TAIL + 1);
    const ys = new Float32Array(TAIL + 1);

    const write = () => {
      for (let i = 0; i <= TAIL; i++) {
        el.style.setProperty(`--x${i}`, `${xs[i].toFixed(1)}px`);
        el.style.setProperty(`--y${i}`, `${ys[i].toFixed(1)}px`);
      }
    };

    const step = (now: number) => {
      // Frame-rate independent, so 120 Hz screens draw the same tail as 60 Hz.
      const elapsed = last ? Math.min(now - last, 64) : 16.7;
      last = now;
      const t = 1 - Math.pow(1 - LINK, elapsed / 16.7);

      let settled = true;
      for (let i = 1; i <= TAIL; i++) {
        xs[i] += (xs[i - 1] - xs[i]) * t;
        ys[i] += (ys[i - 1] - ys[i]) * t;
        if (Math.abs(xs[i - 1] - xs[i]) > 0.5 || Math.abs(ys[i - 1] - ys[i]) > 0.5) settled = false;
      }
      write();

      frame = settled ? 0 : requestAnimationFrame(step);
      if (settled) last = 0;
    };

    const onMove = (e: PointerEvent) => {
      xs[0] = e.clientX - origin.left;
      ys[0] = e.clientY - origin.top;
      if (!placed) {
        // Start with the whole tail under the pointer instead of sweeping in from a corner.
        xs.fill(xs[0]);
        ys.fill(ys[0]);
        placed = true;
      }
      el.dataset.on = '';
      if (!frame) frame = requestAnimationFrame(step);
    };
    const onLeave = () => {
      delete el.dataset.on;
    };
    const onResize = () => {
      origin = el.getBoundingClientRect();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <div ref={ref} className="canvas-spot" aria-hidden="true" />;
}
