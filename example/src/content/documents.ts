import type { TocEntry } from 'doc-shell/layouts/toc/toc.astro';
import { tocs } from './toc';

interface DocumentConfig {
  slug: string;
  title: string;
  description: string;
  toc: TocEntry[];
}

export const siteTitle = 'Space Exploration Manual';

export const documents: DocumentConfig[] = [
  {
    slug: 'main',
    title: 'Main Manual',
    description: 'All example sections combined into a single doc (for baseline navigation).',
    toc: tocs.main,
  },
  {
    slug: 'handbook',
    title: 'Handbook',
    description: 'A cross-document navigation doc with lots of section + row previews.',
    toc: tocs.handbook,
  },
  {
    slug: 'reference',
    title: 'Reference Library',
    description: 'Procedure maps and decision rules linking across documents.',
    toc: tocs.reference,
  },
  {
    slug: 'glossary',
    title: 'Glossary & Terms',
    description: 'Key terms, mappings, and cross-document row references.',
    toc: tocs.glossary,
  },
];
