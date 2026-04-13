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

export interface MermaidResult {
  svg: string;
  width: number;
}

/**
 * Replace Mermaid's default `width="100%"` / `style="max-width:…"` on the
 * root `<svg>` with an explicit pixel width derived from the viewBox and
 * the requested zoom level.  This guarantees that SVG-coordinate font sizes
 * map 1 : 1 to screen pixels at zoom = 100, regardless of diagram complexity.
 */
export function scaleSvg(
  svg: string,
  viewBoxWidth: number,
  zoom: number,
): string {
  const displayWidth = Math.round(viewBoxWidth * zoom / 100);
  let out = svg.replace(/\s*width="100%"/, ` width="${displayWidth}"`);
  out = out.replace(/\s*style="max-width:\s*[\d.]+px;?\s*"/, "");
  return out;
}

export async function renderMermaid(
  code: string,
  theme: "light" | "dark",
): Promise<MermaidResult> {
  const render = getRenderer();

  const prefix = `mermaid-${theme}-${renderCount++}`;
  const [result] = await render([code], {
    prefix,
    mermaidConfig: {
      theme: "base",
      themeVariables: { ...themeVars[theme], fontSize: 16 },
    },
  });

  if (result.status === "rejected") {
    throw new Error(
      `[doc-shell] Diagram render failed: ${result.reason}`,
    );
  }

  return { svg: result.value.svg, width: result.value.width };
}
