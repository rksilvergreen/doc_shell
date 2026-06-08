import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { fileURLToPath } from 'node:url';
import { remarkSectionLevel } from 'doc-shell/plugins/remark-section-level';
import docShell from 'doc-shell/integration';

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        project_name: fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(
          new URL('./src/components', import.meta.url),
        ),
      },
    },
  },
  integrations: [
    mdx({ remarkPlugins: [remarkSectionLevel] }),
    docShell(),
  ],
});
