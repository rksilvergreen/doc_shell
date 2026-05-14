import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import type { GraphvizThemeVars } from "./components/graphviz-diagram/graphviz-theme";

export type { GraphvizThemeVars };

export interface DocShellConfig {
  graphviz?: {
    themeVars?: {
      light?: Partial<GraphvizThemeVars>;
      dark?: Partial<GraphvizThemeVars>;
    };
  };
}

const GRAPHVIZ_VIRTUAL_ID = "virtual:doc-shell/graphviz-theme";
const GRAPHVIZ_RESOLVED_ID = "\0virtual:doc-shell/graphviz-theme";

const here = dirname(fileURLToPath(import.meta.url));
const graphvizThemePath = resolve(
  here,
  "components/graphviz-diagram/graphviz-theme.ts",
);

export default function docShell(
  config: DocShellConfig = {},
): AstroIntegration {
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
                  if (id === GRAPHVIZ_VIRTUAL_ID) return GRAPHVIZ_RESOLVED_ID;
                },
                load(id) {
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
