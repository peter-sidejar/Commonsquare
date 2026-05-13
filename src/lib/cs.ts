// CommonSquare locked design tokens.
// Mirror of tailwind.config.ts + globals.css for use inside SVG / inline
// style props where Tailwind classes don't work (dynamic colors, etc.).

export const CS = {
  ink: "#1A1814",
  paper: "#F4F1EA",
  paper2: "#EBE6DB",
  paper3: "#E0D9C9",
  violet: "#5F4FA8",
  violetD: "#473880",
  violetT: "rgba(95,79,168,0.12)",
  mute: "#8A8378",
  rule: "rgba(26,24,20,0.14)",
  rule2: "rgba(26,24,20,0.28)",
} as const;

export type CSColor = keyof typeof CS;
