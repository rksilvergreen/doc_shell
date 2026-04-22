/**
 * graphviz-theme.ts — colour tokens for build-time-rendered Graphviz
 * diagrams.
 *
 * Unlike Mermaid (which reads its own `themeVariables` config), Graphviz
 * has no notion of a runtime theme — colours are baked into the DOT source
 * via `bgcolor`, `fillcolor`, `color`, `fontcolor`, etc.
 *
 * To keep user DOT clean, `render-graphviz.ts` injects a default-attribute
 * block (`graph[…]; node[…]; edge[…];`) at the top of every graph using
 * the values defined here.  Anything the user explicitly sets in their
 * own DOT still wins because Graphviz processes statements in order.
 */
export interface GraphvizThemeVars {
  /** Page background colour. Maps to `graph[bgcolor=…]`. */
  background?: string;
  /** Default node fill. Maps to `node[fillcolor=…, style=filled]`. */
  nodeColor?: string;
  /** Default node border colour. Maps to `node[color=…]`. */
  nodeBorderColor?: string;
  /** Default node text colour. Maps to `node[fontcolor=…]`. */
  nodeTextColor?: string;
  /** Default edge stroke colour. Maps to `edge[color=…]`. */
  edgeColor?: string;
  /** Default edge label colour. Maps to `edge[fontcolor=…]`. */
  edgeTextColor?: string;
  /** Cluster (subgraph) background colour. */
  clusterColor?: string;
  /** Cluster border colour. */
  clusterBorderColor?: string;
  /** Cluster label colour. */
  clusterTextColor?: string;
  /** Default font family used for both nodes and edges. */
  fontFamily?: string;
}

export const DEFAULT_GRAPHVIZ_THEME_VARS:
  Record<"light" | "dark", GraphvizThemeVars> = {
  light: {
    background: "#faf8f5",
    nodeColor: "#d3d3de",
    nodeBorderColor: "#1c1c1c",
    nodeTextColor: "#1c1c1c",
    edgeColor: "#1c1c1c",
    edgeTextColor: "#1c1c1c",
    clusterColor: "#f3eee7",
    clusterBorderColor: "#1c1c1c",
    clusterTextColor: "#1c1c1c",
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
  },
  dark: {
    background: "#122228",
    nodeColor: "#464654",
    nodeBorderColor: "#dcd8d0",
    nodeTextColor: "#dcd8d0",
    edgeColor: "#dcd8d0",
    edgeTextColor: "#dcd8d0",
    clusterColor: "#1a1b1f",
    clusterBorderColor: "#dcd8d0",
    clusterTextColor: "#dcd8d0",
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
  },
};
