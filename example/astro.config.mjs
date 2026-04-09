import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkSectionLevel } from 'doc-shell/plugins/remark-section-level';

export default defineConfig({
  integrations: [mdx({ remarkPlugins: [remarkSectionLevel] })],
});
