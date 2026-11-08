import type { Metadata, Viewport } from 'next';
import { Martian_Mono, Schibsted_Grotesk } from 'next/font/google';
import './globals.css';

const sans = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = Martian_Mono({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Andrew Hua',
  description:
    'Junior at Carnegie Mellon University studying AI and Applied Math. Software engineering experience at S&P Global and AnthrAI building agent systems, MCP tooling, and RAG pipelines.',
};

export const viewport: Viewport = {
  themeColor: '#121219',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
