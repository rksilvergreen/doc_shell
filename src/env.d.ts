/// <reference types="astro/client" />

declare module "virtual:doc-shell/diagram-theme" {
  import type { DiagramThemeVars } from "./components/diagram/diagram-theme";
  export const themeVars: Record<"light" | "dark", DiagramThemeVars>;
}

declare module "virtual:doc-shell/graphviz-theme" {
  import type { GraphvizThemeVars } from "./components/graphviz-diagram/graphviz-theme";
  export const themeVars: Record<"light" | "dark", GraphvizThemeVars>;
}
