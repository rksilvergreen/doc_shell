/// <reference types="astro/client" />

declare module "virtual:doc-shell/diagram-theme" {
  import type { DiagramThemeVars } from "./components/diagram/diagram-theme";
  export const themeVars: Record<"light" | "dark", DiagramThemeVars>;
}
