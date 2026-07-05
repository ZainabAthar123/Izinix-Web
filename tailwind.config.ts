import type { Config } from "tailwindcss";

/**
 * Design tokens live in two places:
 *  - CSS custom properties in app/globals.css (single source of truth for values)
 *  - This config maps those variables onto Tailwind utilities
 *
 * To retheme the site, edit the :root block in app/globals.css.
 * The default Tailwind palette is intentionally NOT included.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Replace (not extend) the default palette — every color is a token.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",
      bg: {
        primary: "var(--color-bg-primary)",
        secondary: "var(--color-bg-secondary)",
        elevated: "var(--color-bg-elevated)",
      },
      navy: {
        DEFAULT: "var(--color-navy)",
        glow: "var(--color-navy-glow)",
      },
      accent: {
        DEFAULT: "var(--color-accent)",
        bright: "var(--color-accent-bright)",
        dim: "var(--color-accent-dim)",
      },
      ink: {
        DEFAULT: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        tertiary: "var(--color-text-tertiary)",
      },
      line: {
        DEFAULT: "var(--color-border)",
        strong: "var(--color-border-strong)",
      },
      glass: {
        DEFAULT: "var(--color-glass-fill)",
        hover: "var(--color-glass-fill-hover)",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        eyebrow: "0.15em",
        tightest: "-0.02em",
      },
      transitionTimingFunction: {
        // "Viscous" glass ease — used for every glass surface transition.
        glass: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        glass: "550ms",
      },
      zIndex: {
        nav: "50",
        cursor: "80",
        grain: "90",
        transition: "100",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -22px, 0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 24px rgba(255, 90, 31, 0.18)" },
          "50%": { boxShadow: "0 0 64px rgba(255, 90, 31, 0.38)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 42s) linear infinite",
        floaty: "floaty 9s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
