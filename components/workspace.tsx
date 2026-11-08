'use client';

import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import { sectionIds, sectionPaths } from '@/lib/content';

type WorkspaceState = {
  activeId: string;
  drawerOpen: boolean;
};

type WorkspaceActions = {
  openDrawer: () => void;
  /** Close the drawer and return focus to the button that opened it. */
  closeDrawer: () => void;
  /** Close the drawer after choosing a file; focus follows the link instead. */
  dismissDrawer: () => void;
};

export const DRAWER_TOGGLE_ID = 'explorer-toggle';

function focusToggle() {
  requestAnimationFrame(() => document.getElementById(DRAWER_TOGGLE_ID)?.focus());
}

const WorkspaceContext = createContext<{ state: WorkspaceState; actions: WorkspaceActions } | null>(
  null,
);

export function useWorkspace() {
  const ctx = use(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used inside <WorkspaceProvider>');
  return ctx;
}

// Distance from the top of the viewport at which a section counts as "open".
const READ_LINE = 140;

function findActiveId(): string {
  // The last sections can't reach the read line, so the bottom of the page selects the last one.
  const scrolledToEnd =
    window.scrollY > 0 &&
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (scrolledToEnd) return sectionIds[sectionIds.length - 1];

  let current = sectionIds[0];
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top - READ_LINE > 0) break;
    current = id;
  }
  return current;
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Track the section in view. One passive listener, throttled to animation frames.
  // After a click on a section link, the clicked section stays selected until the
  // scroll it started settles, because sections near the page end can't reach the read line.
  useEffect(() => {
    let frame = 0;
    let settle = 0;
    let following: string | null = null;

    const update = () => {
      frame = 0;
      setActiveId(findActiveId());
    };
    const holdUntilSettled = () => {
      clearTimeout(settle);
      settle = window.setTimeout(() => {
        following = null;
      }, 150);
    };
    const onScroll = () => {
      if (following) holdUntilSettled();
      else if (!frame) frame = requestAnimationFrame(update);
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const id = link?.getAttribute('href')?.slice(1);
      if (!id || !sectionPaths.has(id)) return;
      following = id;
      setActiveId(id);
      holdUntilSettled();
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('click', onClick);
    };
  }, []);

  // The drawer only exists on narrow screens; close it if the window widens.
  useEffect(() => {
    if (!drawerOpen) return;
    const wide = window.matchMedia('(min-width: 60rem)');
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setDrawerOpen(false);
      focusToggle();
    };
    const onWide = () => {
      if (wide.matches) setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    document.documentElement.dataset.drawer = 'open';
    return () => {
      document.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
      delete document.documentElement.dataset.drawer;
    };
  }, [drawerOpen]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    focusToggle();
  }, []);
  const dismissDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo(
    () => ({
      state: { activeId, drawerOpen },
      actions: { openDrawer, closeDrawer, dismissDrawer },
    }),
    [activeId, drawerOpen, openDrawer, closeDrawer, dismissDrawer],
  );

  return <WorkspaceContext value={value}>{children}</WorkspaceContext>;
}

// Content behind the open drawer stays out of the tab order and screen readers.
export function WorkspaceMain({ children }: { children: React.ReactNode }) {
  const { state } = useWorkspace();
  return (
    <div className="workspace-main" inert={state.drawerOpen}>
      {children}
    </div>
  );
}
