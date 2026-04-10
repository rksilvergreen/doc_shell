export interface DiagramThemeVars {
  darkMode?: boolean;
  background?: string;
  primaryColor?: string;
  primaryTextColor?: string;
  primaryBorderColor?: string;
  lineColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
}

export const DEFAULT_THEME_VARS: Record<"light" | "dark", DiagramThemeVars> = {
  light: {
    background: "#faf8f5",
    primaryColor: "#d3d3de",
    primaryTextColor: "#1c1c1c",
    primaryBorderColor: "#1c1c1c",
    lineColor: "#1c1c1c",
    secondaryColor: "#e8e4de",
    tertiaryColor: "#f3eee7",
  },
  dark: {
    darkMode: true,
    background: "#122228",
    primaryColor: "#464654",
    primaryTextColor: "#dcd8d0",
    primaryBorderColor: "#dcd8d0",
    lineColor: "#dcd8d0",
    secondaryColor: "#a8a8ad",
    tertiaryColor: "#1a1b1f",
  },
};
