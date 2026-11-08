'use client';

import { Fragment } from 'react';
import { profile, sectionPaths } from '@/lib/content';
import { DocumentIcon, SidebarIcon } from './icons';
import { DRAWER_TOGGLE_ID, useWorkspace } from './workspace';
import styles from './path-bar.module.css';

export function PathBar() {
  const { state, actions } = useWorkspace();
  const path = sectionPaths.get(state.activeId) ?? [];

  return (
    <div className={styles.bar}>
      <button
        id={DRAWER_TOGGLE_ID}
        type="button"
        className={styles.menu}
        aria-expanded={state.drawerOpen}
        aria-controls="explorer"
        onClick={actions.openDrawer}
      >
        <SidebarIcon />
        <span>Files</span>
      </button>

      <nav className={styles.path} aria-label="Breadcrumb" translate="no">
        {path.map((segment, i) => {
          const last = i === path.length - 1;
          return (
            <Fragment key={segment.id + segment.name}>
              {i > 0 ? (
                <span className={i === 1 ? `${styles.sep} ${styles.rootSep}` : styles.sep} aria-hidden="true">
                  /
                </span>
              ) : null}
              {last ? (
                <span className={styles.current}>{segment.name}</span>
              ) : (
                <a
                  href={`#${segment.id}`}
                  className={i === 0 ? `${styles.segment} ${styles.root}` : styles.segment}
                >
                  {segment.name}
                </a>
              )}
            </Fragment>
          );
        })}
      </nav>

      <a className={styles.resume} href={profile.resume} target="_blank" rel="noopener noreferrer">
        <DocumentIcon />
        <span>Resume</span>
      </a>
    </div>
  );
}
