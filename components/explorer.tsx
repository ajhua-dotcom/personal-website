'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { sectionPaths, tree, type TreeNode } from '@/lib/content';
import {
  Chevron,
  CloseIcon,
  FileIcon,
  FolderIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from './icons';
import { useWorkspace } from './workspace';
import styles from './explorer.module.css';

// Row order drives the one-time unfold on page load.
const rowOrder = new Map<TreeNode, number>();
(function number(nodes: TreeNode[]) {
  for (const node of nodes) {
    rowOrder.set(node, rowOrder.size);
    if (node.kind === 'folder') number(node.children);
  }
})(tree);

type TreeProps = {
  depth: number;
  activeId: string;
  collapsed: ReadonlySet<string>;
  onToggle: (id: string) => void;
  onExpand: (id: string) => void;
  onNavigate: () => void;
};

function rowStyle(node: TreeNode, depth: number) {
  return { '--depth': depth, '--i': rowOrder.get(node) ?? 0 } as React.CSSProperties;
}

function LinkGlyph({ icon }: { icon: Extract<TreeNode, { kind: 'link' }>['icon'] }) {
  if (icon === 'pdf') return <FileIcon type="pdf" className={styles.icon} />;
  if (icon === 'github') return <GitHubIcon className={styles.icon} />;
  if (icon === 'linkedin') return <LinkedInIcon className={styles.icon} />;
  return <MailIcon className={styles.icon} />;
}

function TreeList({ nodes, ...props }: TreeProps & { nodes: TreeNode[] }) {
  return (
    <ul className={styles.list} role="list">
      {nodes.map((node) => (
        <TreeItem key={node.kind === 'link' ? node.href : node.id} node={node} {...props} />
      ))}
    </ul>
  );
}

function TreeItem({ node, ...props }: TreeProps & { node: TreeNode }) {
  const { depth, activeId, collapsed, onToggle, onExpand, onNavigate } = props;

  if (node.kind === 'file') {
    const active = node.id === activeId;
    return (
      <li>
        <a
          href={`#${node.id}`}
          className={styles.row}
          style={rowStyle(node, depth)}
          aria-current={active ? 'location' : undefined}
          onClick={onNavigate}
        >
          <span className={styles.spacer} />
          <FileIcon type={node.type} className={styles.icon} />
          <span className={styles.name}>{node.name}</span>
        </a>
      </li>
    );
  }

  if (node.kind === 'link') {
    const opensElsewhere = !node.href.startsWith('mailto:');
    return (
      <li>
        <a
          href={node.href}
          className={styles.row}
          style={rowStyle(node, depth)}
          target={opensElsewhere ? '_blank' : undefined}
          rel={opensElsewhere ? 'noopener noreferrer' : undefined}
          onClick={onNavigate}
        >
          <span className={styles.spacer} />
          <LinkGlyph icon={node.icon} />
          <span className={styles.name}>{node.name}</span>
        </a>
      </li>
    );
  }

  const open = !collapsed.has(node.id);
  const active = node.id === activeId;
  const holdsActive = !open && node.children.some((c) => c.kind !== 'link' && c.id === activeId);
  const listId = `tree-${node.id}`;
  const isSection = sectionPaths.has(node.id);

  return (
    <li>
      <div
        className={styles.folderRow}
        style={rowStyle(node, depth)}
        data-active={active ? '' : undefined}
        data-holds-active={holdsActive ? '' : undefined}
      >
        {isSection ? (
          <>
            <button
              type="button"
              className={styles.twisty}
              aria-expanded={open}
              aria-controls={listId}
              aria-label={`Show files in ${node.name}`}
              onClick={() => onToggle(node.id)}
            >
              <Chevron className={styles.chevron} />
            </button>
            <a
              href={`#${node.id}`}
              className={styles.folderLink}
              aria-current={active ? 'location' : undefined}
              onClick={() => {
                onExpand(node.id);
                onNavigate();
              }}
            >
              <FolderIcon open={open} className={styles.icon} />
              <span className={styles.name}>{node.name}</span>
            </a>
          </>
        ) : (
          <button
            type="button"
            className={styles.folderLink}
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => onToggle(node.id)}
          >
            <span className={styles.twisty}>
              <Chevron className={styles.chevron} />
            </span>
            <FolderIcon open={open} className={styles.icon} />
            <span className={styles.name}>{node.name}</span>
          </button>
        )}
      </div>
      <div
        id={listId}
        className={styles.children}
        data-open={open}
        style={{ '--depth': depth } as React.CSSProperties}
      >
        <div className={styles.childrenInner}>
          <TreeList nodes={node.children} {...props} depth={depth + 1} />
        </div>
      </div>
    </li>
  );
}

export function Explorer() {
  const { state, actions } = useWorkspace();
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(() => new Set());
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (state.drawerOpen) closeRef.current?.focus();
  }, [state.drawerOpen]);

  const onToggle = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const onExpand = useCallback((id: string) => {
    setCollapsed((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <>
      {state.drawerOpen ? (
        <div className={styles.backdrop} onClick={actions.closeDrawer} aria-hidden="true" />
      ) : null}
      <nav
        id="explorer"
        className={styles.explorer}
        data-open={state.drawerOpen}
        aria-label="Site sections"
        translate="no"
      >
        <div className={styles.header}>
          <span className={styles.lights} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.title}>explorer</span>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={actions.closeDrawer}
            aria-label="Close files"
          >
            <CloseIcon />
          </button>
        </div>
        <TreeList
          nodes={tree}
          depth={0}
          activeId={state.activeId}
          collapsed={collapsed}
          onToggle={onToggle}
          onExpand={onExpand}
          onNavigate={actions.dismissDrawer}
        />
      </nav>
    </>
  );
}
