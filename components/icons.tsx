import type { FileType } from '@/lib/content';

// File-type colors match the explorer convention: the tint says what the file is.
export const fileColor: Record<FileType, string> = {
  md: 'var(--file-md)',
  tsx: 'var(--file-tsx)',
  c: 'var(--file-c)',
  py: 'var(--file-py)',
  json: 'var(--file-json)',
  pdf: 'var(--file-pdf)',
};

type IconProps = { className?: string };

export function FileIcon({ type, className }: { type: FileType } & IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 1.5h6l3 3v10h-9z" fill={fileColor[type]} opacity="0.9" />
      <path d="M9.5 1.5v3h3" fill="none" stroke="var(--bg)" strokeOpacity="0.55" strokeWidth="1" />
    </svg>
  );
}

export function FolderIcon({ open, className }: { open: boolean } & IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      {open ? (
        <path d="M1.5 3.5h4.5l1.5 1.5h6v1.5H4.5l-2 6.5h-1zM4.5 7h11l-2 6.5h-11z" fill="var(--folder)" />
      ) : (
        <path d="M1.5 3.5h4.5l1.5 1.5h7v8.5h-13z" fill="var(--folder)" />
      )}
    </svg>
  );
}

export function Chevron({ className }: IconProps) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M4.5 3 7.5 6l-3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 .2a8 8 0 0 0-2.5 15.6c.4 0 .5-.2.5-.4v-1.5c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.4.7 0-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.6 7.6 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.8-3.6 4 .3.3.6.8.6 1.5v2.2c0 .2.1.5.6.4A8 8 0 0 0 8 .2"
      />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.6 1H2.4C1.6 1 1 1.6 1 2.3v11.4c0 .7.6 1.3 1.4 1.3h11.2c.8 0 1.4-.6 1.4-1.3V2.3c0-.7-.6-1.3-1.4-1.3M5.2 12.9H3.1V6.2h2.1zM4.1 5.3a1.2 1.2 0 1 1 0-2.5 1.2 1.2 0 0 1 0 2.5m8.8 7.6h-2.1V9.6c0-.8 0-1.8-1.1-1.8s-1.3.9-1.3 1.8v3.3H6.3V6.2h2v.9c.3-.5 1-1.1 2.1-1.1 2.2 0 2.6 1.4 2.6 3.3z"
      />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="m2.5 4.5 5.5 4 5.5-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function DocumentIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 1.75h5.75l3.25 3.25v9.25h-9z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 1.75V5.25h3.5M5.75 8.5h4.5M5.75 11h4.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function ExternalIcon({ className }: IconProps) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M4 2.5h5.5V8M9.25 2.75 2.75 9.25" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BranchIcon({ className }: IconProps) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="4.5" cy="3.5" r="1.75" />
        <circle cx="4.5" cy="12.5" r="1.75" />
        <circle cx="11.5" cy="5.5" r="1.75" />
        <path d="M4.5 5.25v5.5M11.5 7.25c0 2.5-3 2.5-5.5 4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.75V8l2.25 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SidebarIcon({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="1.75" y="2.75" width="14.5" height="12.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.75 2.75v12.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="m4 4 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
