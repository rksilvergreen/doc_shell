/**
 * render-mermaid.ts — build-time Mermaid renderer for doc-shell.
 *
 * Uses `mermaid-isomorphic` (Playwright + headless Chromium) to produce
 * pixel-accurate SVG output during Astro's SSG build.  A single shared
 * renderer instance is reused across all diagrams so the browser is
 * only launched once per build.
 *
 * Per-diagram colour overrides are passed via the `themeVars` parameter,
 * NOT via Mermaid YAML frontmatter.  MDX/Astro strips leading whitespace
 * from template-literal props, which breaks YAML indentation and silently
 * prevents `config.themeVariables` from reaching Mermaid.  Merging into
 * the `mermaidConfig` we pass to `initialize()` avoids that entirely and
 * also ensures Mermaid's `getThemeVariables()` recomputes derived colours
 * (nodeBkg, mainBkg, etc.) from the overridden inputs.
 */
import {
  createMermaidRenderer,
  type MermaidRenderer,
} from "mermaid-isomorphic";
import { themeVars } from "virtual:doc-shell/diagram-theme";

let renderer: MermaidRenderer | null = null;
let renderCount = 0;

function getRenderer(): MermaidRenderer {
  if (!renderer) {
    renderer = createMermaidRenderer();
  }
  return renderer;
}

export async function renderMermaid(
  code: string,
  theme: "light" | "dark",
): Promise<string> {
  const render = getRenderer();

  const prefix = `mermaid-${theme}-${renderCount++}`;
  const [result] = await render([code], {
    prefix,
    mermaidConfig: {
      theme: "base",
      themeVariables: { ...themeVars[theme] },
    },
  });

  if (result.status === "rejected") {
    throw new Error(
      `[doc-shell] Diagram render failed: ${result.reason}`,
    );
  }

  return result.value.svg;
}
