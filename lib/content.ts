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
    'Hi, I\'m Andrew! I\'m from Toronto and now live in Pittsburgh, where I study AI and applied math at Carnegie Mellon. I like building full-stack applications and designing data pipelines for AI systems.',
    // 'Last summer at S&P Global, I built a multi-agent workflow that let teams query application logs and latency data from Databricks and Splunk using natural language and visualize reliability trends. Before that, I helped automate A/B testing at AnthrAI by building browser agents with Playwright. Teams used them to compare how various simulated user personas navigated different versions of the same website.',
    'Outside of class and work, I enjoy bouldering, watching soccer, and trying new restaurants. I\'m always open to trade food recs!'
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
      'Built MCP servers and a conversational agent from scratch (Python, internal LLM) that let the CTO and senior leadership query 3M+ error logs, latency events, and tickets directly, cutting turnaround from days or weeks of manual Databricks and Splunk analysis to seconds.',
      'Re-architected the agent into a multi-agent workflow (Python, AWS Strands Agents) that automates reliability analysis and visualization for credit ratings applications serving 2M+ users and 40k+ employees. Leadership uses it to set SRE and PM team priorities.',
      'Built an LLM-based static analyzer (Python, RAG) that checks database queries against 600+ pages of Oracle, Postgres, and MongoDB best practices, flagging unsafe or inefficient patterns in CI through an internal dev platform.',
    ],
  },
  {
    id: 'anthrai',
    company: 'AnthrAI',
    url: 'https://www.anthrai.com',
    logo: anthraiLogo,
    role: 'Software Engineer Intern (part-time, remote)',
    location: 'San Francisco, CA',
    start: 'Dec 2025',
    end: 'May 2026',
    points: [
      'Built web-navigation agents (Playwright, Gemini) that parse the DOM and accessibility tree and plan multi-step actions, simulating 6 configurable user personas with 90% action-sequence similarity to real users.',
      'Architected the testing platform’s orchestration layer (Node.js, Redis, Docker), running 50+ concurrent headless-browser agents with retries and per-run isolation to execute 12k+ agent runs across 800+ A/B and hypothesis-test batches.',
      'Developed an agent evaluation harness (Python, SQL) of synthetic websites with varied interactive components and layouts to test navigation reasoning. Traced failures to missed components and action loops, then added state recovery and loop detection, cutting failures 25% and agent steps and API cost 40%.',
    ],
  },
];

export type Project = {
  id: string;
  title: string;
  language: FileType;
  languageLabel: string;
  points: string[];
};

export const projects: Project[] = [
  {
    id: 'malloc',
    title: 'Dynamic memory allocator',
    language: 'c',
    languageLabel: 'C',
    points: [
      'Implemented malloc, free, realloc, and calloc, evolving the free-block structure from an implicit list to a segregated free list indexed by size class. Throughput rose 65× and memory utilization reached 74% through block coalescing and footer elimination.',
      'Wrote a heap consistency checker that validates block alignment, header integrity, and free-list correctness to catch memory corruption systematically.',
    ],
  },
  {
    id: 'rnn-lm',
    title: 'RNN language model with self-attention',
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
        'Foundations of Software Engineering, Computer Systems, Artificial Intelligence, Machine Learning, Data Structures and Algorithms, Autonomous Agents, Functional Programming, Theoretical Computation',
    },
  ],
};

export const awards = [
  {
    result: 'Champion',
    event: 'Canadian Intermediate Mathematics Contest',
    note: 'Top individual score among 9,000+ contestants worldwide',
  },
  {
    result: '2nd place',
    event: 'Harvard-MIT Mathematics Tournament',
  },
  {
    result: '4× qualifier',
    event: 'American Invitational Mathematics Examination (AIME)',
  },
  {
    result: 'Global Top Scorer',
    event: 'PhysicsBowl Contest',
  },
  {
    result: 'Qualifier',
    event: 'Canadian Mathematical Olympiad Repechage',
    note: 'Top 100 score on the Canadian Open Mathematics Challenge',
  },
];

// Each group is drawn as one line on the skills map, in its own color.
// Every skill needs an icon in components/skill-icons.tsx (unknown names get a plain dot).
export const skills = [
  {
    id: 'languages',
    group: 'Languages',
    color: 'var(--route-amber)',
    items: ['Python', 'C', 'C++', 'Java', 'SQL', 'TypeScript'],
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
    items: ['Databricks', 'Splunk', 'Postgres', 'MongoDB', 'Docker', 'Git', 'Linux'],
  },
  {
    id: 'web',
    group: 'Web',
    color: 'var(--route-coral)',
    items: ['Node.js', 'Next.js', 'React', 'Angular', 'Playwright'],
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

// Keep this in the same order as the sections in app/page.tsx: the scroll tracking follows it.
export const tree: TreeNode[] = [
  { kind: 'file', id: 'readme', name: 'README.md', type: 'md' },
  { kind: 'file', id: 'skills', name: 'skills.json', type: 'json' },
  {
    kind: 'folder',
    id: 'experience',
    name: 'experience',
    children: [
      { kind: 'file', id: 'sp-global', name: 'sp-global.md', type: 'md' },
      { kind: 'file', id: 'anthrai', name: 'anthrai.md', type: 'md' },
    ],
  },
  { kind: 'file', id: 'education', name: 'education.md', type: 'md' },
  {
    kind: 'folder',
    id: 'projects',
    name: 'projects',
    children: [
      { kind: 'file', id: 'malloc', name: 'malloc.c', type: 'c' },
      { kind: 'file', id: 'rnn-lm', name: 'rnn-lm.py', type: 'py' },
    ],
  },
  { kind: 'file', id: 'awards', name: 'awards.md', type: 'md' },
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
