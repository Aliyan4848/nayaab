import type { Config } from "tailwindcss";

// NAYAAB design tokens — Phase 2 design system.
// Premium through typography/spacing/photography, not decoration.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161412",        // matte black / deep charcoal — primary text & UI
        charcoal: "#2A2724",
        ivory: "#F7F3EC",      // warm ivory — primary background
        ivoryMuted: "#EFE9DE",
        champagne: "#B8A06B",  // subtle champagne gold — accent, sparing use only
        champagneMuted: "#D9CBA8",
        emerald: "#1F3B32",    // restrained deep emerald — optional secondary accent
        border: "#E4DDCE",
        error: "#8A2E2E",
      },
      fontFamily: {
        // editorial serif for headings/product names; clean sans for UI/body
        serif: ["var(--font-editorial)", "Georgia", "serif"],
        sans: ["var(--font-ui)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1440px",
      },
      letterSpacing: {
        wide2: "0.08em",
      },
    },
  },
  plugins: [],
};

export default config;
