import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-family-body)", ...fontFamily.sans],
        serif: ["var(--font-family-body)", ...fontFamily.serif],
        heading: ["var(--font-family-heading)", ...fontFamily.sans],
        body: ["var(--font-family-body)", ...fontFamily.serif],
      },
      colors: {
        /* Primary palette */
        primary: {
          dark: "var(--color-primary-dark)",
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
        },
        /* Accent palette */
        accent: {
          dark: "var(--color-accent-dark)",
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
        },
        /* Secondary palette */
        secondary: {
          dark: "var(--color-secondary-dark)",
          DEFAULT: "var(--color-secondary)",
          light: "var(--color-secondary-light)",
        },
        /* Tertiary palette */
        tertiary: {
          dark: "var(--color-tertiary-dark)",
          DEFAULT: "var(--color-tertiary)",
          light: "var(--color-tertiary-light)",
        },
        /* Semantic colors */
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        /* Neutrals */
        neutral: {
          "50": "var(--color-neutral-50)",
          "75": "var(--color-neutral-75)",
          "100": "var(--color-neutral-100)",
          "200": "var(--color-neutral-200)",
          "300": "var(--color-neutral-300)",
          "400": "var(--color-neutral-400)",
          "500": "var(--color-neutral-500)",
          "600": "var(--color-neutral-600)",
          "700": "var(--color-neutral-700)",
          "800": "var(--color-neutral-800)",
          "900": "var(--color-neutral-900)",
        },
      },
      spacing: {
        "0": "var(--space-0)",
        "1": "var(--space-1)",
        "2": "var(--space-2)",
        "3": "var(--space-3)",
        "4": "var(--space-4)",
        "5": "var(--space-5)",
        "6": "var(--space-6)",
        "7": "var(--space-7)",
        "8": "var(--space-8)",
        "9": "var(--space-9)",
        "10": "var(--space-10)",
        "12": "var(--space-12)",
        "14": "var(--space-14)",
        "16": "var(--space-16)",
        "20": "var(--space-20)",
        "24": "var(--space-24)",
      },
      fontSize: {
        /* Static sizes */
        "xs": ["var(--font-size-xs)", { lineHeight: "var(--line-height-tight)" }],
        "sm": ["var(--font-size-sm)", { lineHeight: "var(--line-height-normal)" }],
        "base": ["var(--font-size-base)", { lineHeight: "var(--line-height-normal)" }],
        "lg": ["var(--font-size-lg)", { lineHeight: "var(--line-height-relaxed)" }],
        "xl": ["var(--font-size-xl)", { lineHeight: "var(--line-height-relaxed)" }],
        "2xl": ["var(--font-size-2xl)", { lineHeight: "var(--line-height-tight)" }],
        "3xl": ["var(--font-size-3xl)", { lineHeight: "var(--line-height-tight)" }],
        "4xl": ["var(--font-size-4xl)", { lineHeight: "var(--line-height-tight)" }],
        "5xl": ["var(--font-size-5xl)", { lineHeight: "var(--line-height-tight)" }],
        /* Fluid sizes (responsive scaling) */
        "fluid-xs": ["var(--font-size-fluid-xs)", { lineHeight: "var(--line-height-tight)" }],
        "fluid-sm": ["var(--font-size-fluid-sm)", { lineHeight: "var(--line-height-normal)" }],
        "fluid-base": ["var(--font-size-fluid-base)", { lineHeight: "var(--line-height-normal)" }],
        "fluid-lg": ["var(--font-size-fluid-lg)", { lineHeight: "var(--line-height-relaxed)" }],
        "fluid-xl": ["var(--font-size-fluid-xl)", { lineHeight: "var(--line-height-relaxed)" }],
        "fluid-2xl": ["var(--font-size-fluid-2xl)", { lineHeight: "var(--line-height-tight)" }],
        "fluid-3xl": ["var(--font-size-fluid-3xl)", { lineHeight: "var(--line-height-tight)" }],
        "fluid-4xl": ["var(--font-size-fluid-4xl)", { lineHeight: "var(--line-height-tight)" }],
        "fluid-5xl": ["var(--font-size-fluid-5xl)", { lineHeight: "var(--line-height-tight)" }],
      },
      borderRadius: {
        "none": "var(--radius-none)",
        "sm": "var(--radius-sm)",
        "base": "var(--radius-base)",
        "md": "var(--radius-md)",
        "lg": "var(--radius-lg)",
        "xl": "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "full": "var(--radius-full)",
      },
      boxShadow: {
        "none": "none",
        "xs": "var(--shadow-xs)",
        "sm": "var(--shadow-sm)",
        "base": "var(--shadow-base)",
        "md": "var(--shadow-md)",
        "lg": "var(--shadow-lg)",
        "xl": "var(--shadow-xl)",
      },
      transitionDuration: {
        "fast": "var(--transition-fast)",
        "base": "var(--transition-base)",
        "slow": "var(--transition-slow)",
        "slower": "var(--transition-slower)",
      },
    },
  },
} satisfies Config;
