// Skill icons for the skills map. Brand marks come from Simple Icons (CC0) and are drawn
// in one colour, since several brand colours (Next.js, NumPy, pandas) vanish on a dark page.
// Only the icons imported here end up in the build. This module is used by server components.
import {
  siAngular,
  siC,
  siCplusplus,
  siDatabricks,
  siDocker,
  siGit,
  siLinux,
  siModelcontextprotocol,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siOpenjdk,
  siPandas,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siSplunk,
  siTypescript,
} from 'simple-icons';

const brandPaths: Record<string, string> = {
  Python: siPython.path,
  C: siC.path,
  TypeScript: siTypescript.path,
  Java: siOpenjdk.path,
  'C++': siCplusplus.path,
  PyTorch: siPytorch.path,
  NumPy: siNumpy.path,
  Pandas: siPandas.path,
  MCP: siModelcontextprotocol.path,
  Databricks: siDatabricks.path,
  MongoDB: siMongodb.path,
  Postgres: siPostgresql.path,
  Splunk: siSplunk.path,
  Docker: siDocker.path,
  Git: siGit.path,
  Linux: siLinux.path,
  'Node.js': siNodedotjs.path,
  'Next.js': siNextdotjs.path,
  React: siReact.path,
  Angular: siAngular.path,
};

// Concepts without a brand mark, drawn to sit at the same visual weight.
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const conceptIcons: Record<string, React.ReactNode> = {
  // A database cylinder.
  SQL: (
    <g {...stroke}>
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5v13c0 1.66 3.58 3 8 3s8-1.34 8-3v-13" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </g>
  ),
  // A document being searched: retrieval-augmented generation.
  RAG: (
    <g {...stroke}>
      <path d="M12.5 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h4" />
      <path d="M12.5 2.5 18.5 8.5v2" />
      <path d="M12.5 2.5v6h6" />
      <circle cx="16" cy="16" r="3.25" />
      <path d="m18.4 18.4 3.1 3.1" />
    </g>
  ),
  // A browser window with a pointer: browser automation (Simple Icons has no Playwright mark).
  Playwright: (
    <g {...stroke}>
      <rect x="2.5" y="3.5" width="19" height="15" rx="2" />
      <path d="M2.5 8h19" />
      <path d="m12 11 6.5 2.5-2.75 1.25L14.5 17.5Z" />
    </g>
  ),
  // A spark: generative models.
  LLMs: (
    <g fill="currentColor">
      <path d="M10 2.5c.55 4.7 2.75 7.35 8.5 8.75-5.75 1.4-7.95 4.05-8.5 8.75-.55-4.7-2.75-7.35-8.5-8.75C7.25 9.85 9.45 7.2 10 2.5Z" />
      <path d="M19 14.5c.25 2.1 1.2 3.25 3.5 3.75-2.3.5-3.25 1.65-3.5 3.75-.25-2.1-1.2-3.25-3.5-3.75 2.3-.5 3.25-1.65 3.5-3.75Z" />
    </g>
  ),
};

export function SkillIcon({ name, className }: { name: string; className?: string }) {
  const path = brandPaths[name];
  const concept = conceptIcons[name];
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      {path ? (
        <path d={path} fill="currentColor" />
      ) : concept ? (
        concept
      ) : (
        <circle cx="12" cy="12" r="4" fill="currentColor" />
      )}
    </svg>
  );
}
