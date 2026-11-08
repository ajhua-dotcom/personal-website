'use client';

import { useEffect, useState } from 'react';
import { sectionPaths } from '@/lib/content';
import { BranchIcon, ClockIcon } from './icons';
import { useWorkspace } from './workspace';
import styles from './status-bar.module.css';

// The language mode an editor shows for the open file.
const languageByExtension: Record<string, string> = {
  md: 'Markdown',
  c: 'C',
  py: 'Python',
  json: 'JSON',
};

const pittsburghTime = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  hour: 'numeric',
  minute: '2-digit',
});

// Client-only: the server can't know the visitor's "now", so render nothing until mounted.
function usePittsburghTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setTime(pittsburghTime.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function StatusBar() {
  const { state } = useWorkspace();
  const time = usePittsburghTime();

  const path = sectionPaths.get(state.activeId);
  const fileName = path?.[path.length - 1]?.name ?? '';
  const extension = fileName.includes('.') ? fileName.split('.').pop() : undefined;
  const language = extension ? languageByExtension[extension] : 'Folder';

  return (
    <div className={styles.bar} translate="no">
      <span className={`${styles.item} ${styles.branch}`}>
        <BranchIcon />
        main
      </span>
      <span className={styles.item}>Pittsburgh, PA</span>
      {time ? (
        <span className={styles.item}>
          <ClockIcon />
          <time>{time} ET</time>
        </span>
      ) : null}
      <span className={styles.spacer} />
      <span className={styles.item}>{language}</span>
      <span className={styles.item}>UTF-8</span>
    </div>
  );
}
