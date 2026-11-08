// Everything the site says lives in this file. Edit copy here, not in components.
import type { StaticImageData } from 'next/image';
import anthraiLogo from '@/assets/logos/anthrai.png';
import cmuLogo from '@/assets/logos/cmu.svg';
import spGlobalLogo from '@/assets/logos/sp-global.png';

export const profile = {
  name: 'Andrew Hua',
  role: 'Junior at Carnegie Mellon University studying AI and Applied Math',
  // The short introduction under your name. Two or three sentences reads best.
  intro: [
    'I build AI agent systems and the tools around them. This summer at S&P Global I built multi-agent workflows and MCP servers that let senior leadership query millions of error logs in plain English.',
    'Before that, at AnthrAI, I shipped a platform that runs thousands of persona-driven browser agents to test web interfaces. At CMU I study computational and applied mathematics and artificial intelligence.',
  ],
  email: 'ajhua@andrew.cmu.edu',
  github: 'https://github.com/ajhua-dotcom',
  linkedin: 'https://www.linkedin.com/in/andrew-j-hua/',
  resume: '/andrew-hua-resume.pdf',
};

export type Experience = {
  id: string;
  company: string;
  url: string;
  logo: StaticImageData;
  role: string;
  location: string;
  start: string;
  end: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    id: 'sp-global',
    company: 'S&P Global',
    url: 'https://www.spglobal.com',
    logo: spGlobalLogo,
    role: 'Software Engineer Intern',
    location: 'New York, NY',
    start: 'Jun 2026',
    end: 'Aug 2026',
    points: [
      'Built a multi-agent workflow (15+ agents) that produces business insights and data visualizations on the reliability of High Value Ratings applications, used by 2M+ external users and 40k+ employees. Cut the division-wide application error rate by 6%.',
      'Built MCP tools, servers, and conversational agents that let the CTO and senior leadership search 3M+ error logs, latency events, and problem tickets with natural-language queries, replacing manual pulls from Databricks and Splunk Observability Cloud.',
      'Built a repository scanner using an internal LLM and a RAG pipeline over 600+ pages of Oracle, Postgres, and MongoDB best-practice documentation, flagging dangerous, inefficient, and unreliable database queries before deployment.',
    ],
  },
  {
    id: 'anthrai',
    company: 'AnthrAI',
    url: 'https://www.anthrai.com',
    logo: anthraiLogo,
    role: 'Software Engineer Intern',
    location: 'San Francisco, CA',
    start: 'Dec 2025',
    end: 'Jun 2026',
    points: [
      'Built AI web-navigation agents that simulate 6 configurable user personas with over 90% behavioral similarity to real users, enabling automated hypothesis testing on third-party web interfaces.',
      'Shipped an end-to-end UI/UX testing platform (Next.js, Vercel) that orchestrated 12k+ automated agents across 400+ A/B and hypothesis-test batches for 1,000+ users.',
      'Developed KPI and performance metrics in Python and SQL across 1,200+ simulation batches, cutting simulation failures by 25% and agent navigation steps and API costs by 40%.',
    ],
  },
];

export type Project = {
  id: string;
  title: string;
  date: string;
  language: FileType;
  languageLabel: string;
  points: string[];
};

export const projects: Project[] = [
  {
    id: 'malloc',
    title: 'Dynamic memory allocator',
    date: 'Mar 2026',
    language: 'c',
    languageLabel: 'C',
    points: [
      'Implemented malloc, free, realloc, and calloc, evolving the free-block structure from an implicit list to a segregated free list indexed by size class. Throughput rose 65× to 6,500+ KOPS and memory utilization reached 74% through block coalescing and footer elimination.',
      'Wrote a heap consistency checker that validates block alignment, header integrity, and free-list correctness to catch memory corruption systematically.',
    ],
  },
  {
    id: 'rnn-lm',
    title: 'RNN language model with self-attention',
    date: 'Nov 2025',
    language: 'py',
    languageLabel: 'Python',
    points: [
      'Built an RNN language model with self-attention, a custom tokenizer, and greedy and stochastic decoding, trained on 100K short stories (10K held out) across 20 configurations on cloud GPUs.',
      'Reached a validation loss of 2.30 (about 10 perplexity), tracking and plotting evaluation metrics with NumPy and Matplotlib.',
    ],
  },
];

export const education = {
  school: 'Carnegie Mellon University',
  url: 'https://www.cmu.edu',
  logo: cmuLogo,
  location: 'Pittsburgh, PA',
  start: 'Aug 2024',
  end: 'May 2028',
  degrees: [
    'B.S. in Computational and Applied Mathematics',
    'B.S. in Artificial Intelligence',
  ],
  details: [
    { term: 'GPA', value: '3.8 / 4.0' },
    {
      term: 'Honors',
      value: 'Dean’s List, High Honors: Fall 2024, Spring 2025, Fall 2025, Spring 2026',
    },
    {
      term: 'Coursework',
      value:
        'Foundations of Software Engineering, Artificial Intelligence, Machine Learning, Data Structures and Algorithms, Autonomous Agents, Functional Programming, Theoretical Computation',
    },
  ],
};

export const awards = [
  {
    result: 'Champion',
    event: 'Canadian Intermediate Mathematics Competition',
    note: 'Top individual score among 9,000 contestants worldwide',
  },
  {
    result: '2nd place',
    event: 'Harvard-MIT Mathematics Tournament',
  },
  {
    result: '4× qualifier',
    event: 'American Invitational Mathematics Examination (AIME)',
  },
];

// Each group is drawn as one line on the skills map, in its own color.
// Every skill needs an icon in components/skill-icons.tsx (unknown names get a plain dot).
export const skills = [
  {
    id: 'languages',
    group: 'Languages',
    color: 'var(--route-amber)',
    items: ['Python', 'SQL', 'TypeScript', 'Java', 'C++'],
  },
  {
    id: 'ml',
    group: 'ML and AI',
    color: 'var(--route-violet)',
    items: ['PyTorch', 'NumPy', 'Pandas', 'RAG', 'MCP', 'LLMs'],
  },
  {
    id: 'data',
    group: 'Data and infra',
    color: 'var(--route-cyan)',
    items: ['Databricks', 'MongoDB', 'Postgres', 'Docker', 'Kubernetes', 'Git', 'Linux'],
  },
  {
    id: 'web',
    group: 'Web',
    color: 'var(--route-coral)',
    items: ['Next.js', 'React', 'Angular'],
  },
];

// ---------------------------------------------------------------------------
// The explorer tree. File extensions say what kind of content each item is,
// and every `id` matches an element id on the page.

export type FileType = 'md' | 'tsx' | 'c' | 'py' | 'json' | 'pdf';

export type TreeNode =
  | { kind: 'file'; id: string; name: string; type: FileType }
  | { kind: 'folder'; id: string; name: string; children: TreeNode[] }
  | { kind: 'link'; name: string; href: string; icon: 'pdf' | 'github' | 'linkedin' | 'mail' };

export const ROOT = 'andrew-hua';

export const tree: TreeNode[] = [
  { kind: 'file', id: 'readme', name: 'README.md', type: 'md' },
  {
    kind: 'folder',
    id: 'experience',
    name: 'experience',
    children: [
      { kind: 'file', id: 'sp-global', name: 'sp-global.md', type: 'md' },
      { kind: 'file', id: 'anthrai', name: 'anthrai.md', type: 'md' },
    ],
  },
  {
    kind: 'folder',
    id: 'projects',
    name: 'projects',
    children: [
      { kind: 'file', id: 'malloc', name: 'malloc.c', type: 'c' },
      { kind: 'file', id: 'rnn-lm', name: 'rnn-lm.py', type: 'py' },
    ],
  },
  { kind: 'file', id: 'education', name: 'education.md', type: 'md' },
  { kind: 'file', id: 'awards', name: 'awards.md', type: 'md' },
  { kind: 'file', id: 'skills', name: 'skills.json', type: 'json' },
  {
    kind: 'folder',
    id: 'links',
    name: 'links',
    children: [
      { kind: 'link', name: 'resume.pdf', href: profile.resume, icon: 'pdf' },
      { kind: 'link', name: 'github', href: profile.github, icon: 'github' },
      { kind: 'link', name: 'linkedin', href: profile.linkedin, icon: 'linkedin' },
      { kind: 'link', name: 'email', href: `mailto:${profile.email}`, icon: 'mail' },
    ],
  },
];

// Section ids in page order, with the path shown in the bar above the content.
// Each path segment carries the id it links back to.
export type PathSegment = { name: string; id: string };

function collectPaths(
  nodes: TreeNode[],
  parents: PathSegment[],
  out: Map<string, PathSegment[]>,
) {
  for (const node of nodes) {
    if (node.kind === 'link' || node.id === 'links') continue;
    const path = [...parents, { name: node.name, id: node.id }];
    out.set(node.id, path);
    if (node.kind === 'folder') collectPaths(node.children, path, out);
  }
  return out;
}

export const sectionPaths: ReadonlyMap<string, PathSegment[]> = collectPaths(
  tree,
  [{ name: ROOT, id: 'readme' }],
  new Map(),
);
export const sectionIds: readonly string[] = [...sectionPaths.keys()];
