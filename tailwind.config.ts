import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1814",
        paper: "#F4F1EA",
        paper2: "#EBE6DB",
        paper3: "#E0D9C9",
        violet: {
          DEFAULT: "#5F4FA8",
          d: "#473880",
          t: "rgba(95,79,168,0.12)",
        },
        mute: "#8A8378",
        rule: "rgba(26,24,20,0.14)",
        "rule-2": "rgba(26,24,20,0.28)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "mono-2xs": ["10px", { lineHeight: "1.2", letterSpacing: "0.14em" }],
        "mono-xs": ["11px", { lineHeight: "1.2", letterSpacing: "0.14em" }],
        "display-sm": ["32px", { lineHeight: "1.05", letterSpacing: "-0.035em" }],
        "display-md": ["44px", { lineHeight: "1.05", letterSpacing: "-0.035em" }],
        "display-lg": ["72px", { lineHeight: "1.02", letterSpacing: "-0.045em" }],
        "display-xl": ["92px", { lineHeight: "1.0", letterSpacing: "-0.045em" }],
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "6px",
        md: "12px",
        lg: "14px",
        xl: "18px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 0 rgba(26,24,20,0.04), 0 12px 32px -16px rgba(26,24,20,0.18)",
        float: "0 30px 60px -30px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
