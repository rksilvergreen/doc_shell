/**
 * render-mermaid.ts — build-time Mermaid renderer for doc-shell.
 *
 * Uses `mermaid-isomorphic` (Playwright + headless Chromium) to produce
 * pixel-accurate SVG output during Astro's SSG build.  A single shared
 * renderer instance is reused across all diagrams so the browser is
 * only launched once per build.
 */
import {
  createMermaidRenderer,
  type MermaidRenderer,
} from "mermaid-isomorphic";

let renderer: MermaidRenderer | null = null;

function getRenderer(): MermaidRenderer {
  if (!renderer) {
    renderer = createMermaidRenderer();
  }
  return renderer;
}

const THEME_VARS = {
  light: {
    background: "#faf8f5",
    primaryColor: "#d6ebe2",
    primaryTextColor: "#1c1c1c",
    primaryBorderColor: "#2d5a4a",
    lineColor: "#2d5a4a",
    secondaryColor: "#e8e4de",
    tertiaryColor: "#f3eee7",
  },
  dark: {
    darkMode: true,
    background: "#222228",
    primaryColor: "#2d5a4a",
    primaryTextColor: "#dcd8d0",
    primaryBorderColor: "#5aaa8a",
    lineColor: "#5aaa8a",
    secondaryColor: "#35363d",
    tertiaryColor: "#1a1b1f",
  },
} as const;

export async function renderMermaid(
  code: string,
  theme: "light" | "dark",
): Promise<string> {
  const render = getRenderer();

  const [result] = await render([code], {
    mermaidConfig: {
      theme: theme === "dark" ? "dark" : "default",
      themeVariables: THEME_VARS[theme],
    },
  });

  if (result.status === "rejected") {
    throw new Error(
      `[doc-shell] Diagram render failed: ${result.reason}`,
    );
  }

  return result.value.svg;
}
