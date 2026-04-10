import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import type { DiagramThemeVars } from "./components/diagram/diagram-theme";

export type { DiagramThemeVars };

export interface DocShellConfig {
  diagram?: {
    themeVars?: {
      light?: Partial<DiagramThemeVars>;
      dark?: Partial<DiagramThemeVars>;
    };
  };
}

const VIRTUAL_ID = "virtual:doc-shell/diagram-theme";
const RESOLVED_ID = "\0virtual:doc-shell/diagram-theme";

const diagramThemePath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "components/diagram/diagram-theme.ts",
);

export default function docShell(
  config: DocShellConfig = {},
): AstroIntegration {
  const lightOverrides = JSON.stringify(config.diagram?.themeVars?.light ?? {});
  const darkOverrides = JSON.stringify(config.diagram?.themeVars?.dark ?? {});

  const virtualSource = [
    `import { DEFAULT_THEME_VARS } from ${JSON.stringify(diagramThemePath)};`,
    `export const themeVars = {`,
    `  light: { ...DEFAULT_THEME_VARS.light, ...${lightOverrides} },`,
    `  dark:  { ...DEFAULT_THEME_VARS.dark,  ...${darkOverrides} },`,
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
                  if (id === VIRTUAL_ID) return RESOLVED_ID;
                },
                load(id) {
                  if (id === RESOLVED_ID) return virtualSource;
                },
              },
            ],
          },
        });
      },
    },
  };
}
