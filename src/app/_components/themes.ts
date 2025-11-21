export type Season = "fall" | "winter" | "spring" | "summer";

export interface Theme {
  name: string;
  emoji: string;
  gradient: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  background: {
    primary: string;
    secondary: string;
    card: string;
  };
  border: string;
  shadow: string;
}

export const themes: Record<Season, Theme> = {
  fall: {
    name: "Fall",
    emoji: "🍂",
    gradient: "theme-gradient",
    primary: "theme-primary theme-primary-hover",
    primaryHover: "",
    secondary: "bg-fall-olive/10 text-fall-brown hover:bg-fall-olive/20",
    accent: "text-fall-orange",
    text: {
      primary: "text-[#3B3B39]",
      secondary: "text-[#59010F]",
      muted: "text-[#C08B61]",
    },
    background: {
      primary: "theme-bg-primary backdrop-blur",
      secondary: "theme-bg-secondary",
      card: "theme-bg-card",
    },
    border: "theme-border",
    shadow: "theme-shadow border theme-border",
  },
  winter: {
    name: "Winter",
    emoji: "❄️",
    gradient: "theme-gradient",
    primary: "theme-primary theme-primary-hover",
    primaryHover: "",
    secondary: "theme-bg-secondary theme-text-primary hover:theme-bg-hover",
    accent: "theme-accent",
    text: {
      primary: "theme-text-primary",
      secondary: "theme-text-secondary",
      muted: "theme-text-muted",
    },
    background: {
      primary: "theme-bg-primary backdrop-blur",
      secondary: "theme-bg-secondary",
      card: "theme-bg-card",
    },
    border: "border-slate-200",
    shadow: "shadow-lg border border-blue-100",
  },
  spring: {
    name: "Spring",
    emoji: "🌸",
    gradient: "theme-gradient",
    primary: "theme-primary theme-primary-hover",
    primaryHover: "",
    secondary: "theme-bg-secondary theme-text-primary hover:theme-bg-hover",
    accent: "theme-accent",
    text: {
      primary: "theme-text-primary",
      secondary: "theme-text-secondary",
      muted: "theme-text-muted",
    },
    background: {
      primary: "theme-bg-primary backdrop-blur",
      secondary: "theme-bg-secondary",
      card: "theme-bg-card",
    },
    border: "theme-border",
    shadow: "theme-shadow border theme-border",
  },
  summer: {
    name: "Summer",
    emoji: "☀️",
    gradient: "theme-gradient",
    primary: "theme-primary theme-primary-hover",
    primaryHover: "",
    secondary: "theme-bg-secondary theme-text-primary hover:theme-bg-hover",
    accent: "theme-accent",
    text: {
      primary: "theme-text-primary",
      secondary: "theme-text-secondary",
      muted: "theme-text-muted",
    },
    background: {
      primary: "theme-bg-primary backdrop-blur",
      secondary: "theme-bg-secondary",
      card: "theme-bg-card",
    },
    border: "theme-border",
    shadow: "theme-shadow border theme-border",
  },
};

// Helper function to get current season based on month
export function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring"; // March - May
  if (month >= 5 && month <= 7) return "summer"; // June - August
  if (month >= 8 && month <= 10) return "fall"; // September - November
  return "winter"; // December - February
}
