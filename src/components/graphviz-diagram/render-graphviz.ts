/**
 * render-graphviz.ts — build-time Graphviz renderer for doc-shell.
 *
 * Uses `@hpcc-js/wasm-graphviz` (a WebAssembly build of Graphviz) so the
 * SSG build needs no system-installed `dot` binary and works the same on
 * every CI runner.  A single Graphviz instance is loaded lazily and
 * reused across all diagrams in a build.
 *
 * Theming: the user's DOT source is left untouched syntactically, but a
 * default-attribute block (`graph[…]; node[…]; edge[…];`) is injected
 * just inside the opening `{` so theme colours apply unless the user
 * overrides them on a specific node/edge.  Each render call also rewrites
 * Graphviz's auto-generated SVG ids (`graph0`, `node1`, `edge1`, …) with
 * a unique prefix so multiple diagrams can coexist on the same page.
 */
import type { Graphviz as GraphvizInstance } from "@hpcc-js/wasm-graphviz";
import { themeVars } from "virtual:doc-shell/graphviz-theme";
import type { GraphvizThemeVars } from "./graphviz-theme";

let loadPromise: Promise<GraphvizInstance> | null = null;
let renderCount = 0;

async function getGraphviz(): Promise<GraphvizInstance> {
  if (!loadPromise) {
    const { Graphviz } = await import("@hpcc-js/wasm-graphviz");
    loadPromise = Graphviz.load();
  }
  return loadPromise;
}

export interface GraphvizResult {
  svg: string;
  width: number;
  height: number;
}

/**
 * Replace Graphviz's default `width="Xpt" height="Ypt"` on the root
 * `<svg>` with explicit pixel sizes derived from the viewBox and the
 * requested zoom level.  At zoom = 100 one Graphviz point maps to one
 * CSS pixel, matching the natural author-specified dimensions.
 */
export function scaleSvg(
  svg: string,
  viewBoxWidth: number,
  viewBoxHeight: number,
  zoom: number,
): string {
  const displayWidth = Math.round(viewBoxWidth * zoom / 100);
  const displayHeight = Math.round(viewBoxHeight * zoom / 100);
  let out = svg.replace(
    /\swidth="[\d.]+(?:pt|px)?"/,
    ` width="${displayWidth}"`,
  );
  out = out.replace(
    /\sheight="[\d.]+(?:pt|px)?"/,
    ` height="${displayHeight}"`,
  );
  return out;
}

const GRAPH_OPEN_RE =
  /\b(strict\s+)?((?:di)?graph)\b(?:\s+(?:"[^"]*"|[A-Za-z_][\w]*))?\s*\{/i;

function buildDefaultsBlock(t: GraphvizThemeVars): string {
  const lines: string[] = [];

  const graphAttrs = pickPairs({
    bgcolor: t.background,
    fontname: t.fontFamily,
    fontcolor: t.nodeTextColor,
  });
  if (graphAttrs) lines.push(`graph [${graphAttrs}];`);

  const nodeAttrs = pickPairs({
    style: t.nodeColor ? "filled" : undefined,
    fillcolor: t.nodeColor,
    color: t.nodeBorderColor,
    fontcolor: t.nodeTextColor,
    fontname: t.fontFamily,
  });
  if (nodeAttrs) lines.push(`node [${nodeAttrs}];`);

  const edgeAttrs = pickPairs({
    color: t.edgeColor,
    fontcolor: t.edgeTextColor,
    fontname: t.fontFamily,
  });
  if (edgeAttrs) lines.push(`edge [${edgeAttrs}];`);

  return lines.join("\n  ");
}

function pickPairs(attrs: Record<string, string | undefined>): string {
  return Object.entries(attrs)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}="${escapeAttr(v as string)}"`)
    .join(" ");
}

function escapeAttr(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function injectThemeDefaults(
  dot: string,
  theme: GraphvizThemeVars,
  clusterTheme: Pick<
    GraphvizThemeVars,
    "clusterColor" | "clusterBorderColor" | "clusterTextColor"
  >,
): string {
  const defaults = buildDefaultsBlock(theme);
  if (!defaults) return dot;

  const m = dot.match(GRAPH_OPEN_RE);
  if (!m || m.index === undefined) return dot;

  const insertAt = m.index + m[0].length;
  let head = dot.slice(0, insertAt);
  let tail = dot.slice(insertAt);

  // Apply cluster defaults inside every `subgraph cluster_… {` block by
  // wrapping each with its own default-attribute lines.  Graphviz only
  // recognises clusters whose name begins with `cluster`.
  const clusterDefaults = buildClusterDefaults(clusterTheme);
  if (clusterDefaults) {
    tail = tail.replace(
      /\b(subgraph\s+(?:"cluster[^"]*"|cluster\w*))\s*\{/gi,
      (_match, decl) => `${decl} {\n  ${clusterDefaults}`,
    );
  }

  return `${head}\n  ${defaults}\n${tail}`;
}

function buildClusterDefaults(t: {
  clusterColor?: string;
  clusterBorderColor?: string;
  clusterTextColor?: string;
}): string {
  const pairs = pickPairs({
    style: t.clusterColor ? "filled" : undefined,
    fillcolor: t.clusterColor,
    color: t.clusterBorderColor,
    fontcolor: t.clusterTextColor,
  });
  return pairs ? `graph [${pairs}];` : "";
}

function uniquifyIds(svg: string, prefix: string): string {
  return svg
    .replace(/\bid="([^"]+)"/g, (_, id) => `id="${prefix}-${id}"`)
    .replace(/\burl\(#([^)]+)\)/g, (_, id) => `url(#${prefix}-${id})`)
    .replace(
      /\bxlink:href="#([^"]+)"/g,
      (_, id) => `xlink:href="#${prefix}-${id}"`,
    )
    .replace(/\bhref="#([^"]+)"/g, (_, id) => `href="#${prefix}-${id}"`);
}

export async function renderGraphviz(
  code: string,
  theme: "light" | "dark",
): Promise<GraphvizResult> {
  const gv = await getGraphviz();

  const vars = themeVars[theme];
  const dot = injectThemeDefaults(code, vars, vars);

  let rawSvg: string;
  try {
    rawSvg = gv.dot(dot);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new Error(`[doc-shell] Graphviz render failed: ${reason}`);
  }

  const prefix = `graphviz-${theme}-${renderCount++}`;
  const svg = uniquifyIds(rawSvg, prefix);

  const viewBoxMatch = svg.match(
    /viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.]+)\s+([\d.]+)"/,
  );
  const width = viewBoxMatch ? parseFloat(viewBoxMatch[1]) : 0;
  const height = viewBoxMatch ? parseFloat(viewBoxMatch[2]) : 0;

  return { svg, width, height };
}
