import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkSectionLevel } from 'doc-shell/plugins/remark-section-level';
import docShell from 'doc-shell/integration';

export default defineConfig({
  integrations: [
    mdx({ remarkPlugins: [remarkSectionLevel] }),
    docShell({
      diagram: {
        themeVars: {
          light: { primaryColor: "#c8e6ff", lineColor: "#3366aa" },
          dark:  { primaryColor: "#1a3355", lineColor: "#6699cc" },
        },
      },
    }),
  ],
});
