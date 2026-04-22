import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import type { DiagramThemeVars } from "./components/diagram/diagram-theme";
import type { GraphvizThemeVars } from "./components/graphviz-diagram/graphviz-theme";

export type { DiagramThemeVars, GraphvizThemeVars };

export interface DocShellConfig {
  diagram?: {
    themeVars?: {
      light?: Partial<DiagramThemeVars>;
      dark?: Partial<DiagramThemeVars>;
    };
  };
  graphviz?: {
    themeVars?: {
      light?: Partial<GraphvizThemeVars>;
      dark?: Partial<GraphvizThemeVars>;
    };
  };
}

const DIAGRAM_VIRTUAL_ID = "virtual:doc-shell/diagram-theme";
const DIAGRAM_RESOLVED_ID = "\0virtual:doc-shell/diagram-theme";
const GRAPHVIZ_VIRTUAL_ID = "virtual:doc-shell/graphviz-theme";
const GRAPHVIZ_RESOLVED_ID = "\0virtual:doc-shell/graphviz-theme";

const here = dirname(fileURLToPath(import.meta.url));
const diagramThemePath = resolve(here, "components/diagram/diagram-theme.ts");
const graphvizThemePath = resolve(
  here,
  "components/graphviz-diagram/graphviz-theme.ts",
);

export default function docShell(
  config: DocShellConfig = {},
): AstroIntegration {
  const lightOverrides = JSON.stringify(config.diagram?.themeVars?.light ?? {});
  const darkOverrides = JSON.stringify(config.diagram?.themeVars?.dark ?? {});

  const diagramSource = [
    `import { DEFAULT_THEME_VARS } from ${JSON.stringify(diagramThemePath)};`,
    `export const themeVars = {`,
    `  light: { ...DEFAULT_THEME_VARS.light, ...${lightOverrides} },`,
    `  dark:  { ...DEFAULT_THEME_VARS.dark,  ...${darkOverrides} },`,
    `};`,
  ].join("\n");

  const graphvizLightOverrides = JSON.stringify(
    config.graphviz?.themeVars?.light ?? {},
  );
  const graphvizDarkOverrides = JSON.stringify(
    config.graphviz?.themeVars?.dark ?? {},
  );

  const graphvizSource = [
    `import { DEFAULT_GRAPHVIZ_THEME_VARS } from ${JSON.stringify(graphvizThemePath)};`,
    `export const themeVars = {`,
    `  light: { ...DEFAULT_GRAPHVIZ_THEME_VARS.light, ...${graphvizLightOverrides} },`,
    `  dark:  { ...DEFAULT_GRAPHVIZ_THEME_VARS.dark,  ...${graphvizDarkOverrides} },`,
    `};`,
  ].join("\n");

  return {
    name: "doc-shell",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: "doc-shell-virtual-config",
                resolveId(id) {
                  if (id === DIAGRAM_VIRTUAL_ID) return DIAGRAM_RESOLVED_ID;
                  if (id === GRAPHVIZ_VIRTUAL_ID) return GRAPHVIZ_RESOLVED_ID;
                },
                load(id) {
                  if (id === DIAGRAM_RESOLVED_ID) return diagramSource;
                  if (id === GRAPHVIZ_RESOLVED_ID) return graphvizSource;
                },
              },
            ],
          },
        });
      },
    },
  };
}
