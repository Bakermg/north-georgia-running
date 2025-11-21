"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Season, Theme } from "./themes";
import { themes, getCurrentSeason } from "./themes";

interface ThemeContextType {
  theme: Theme;
  season: Season;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [season, setSeason] = useState<Season>(getCurrentSeason());
  const [theme, setTheme] = useState<Theme>(themes[season]);

  useEffect(() => {
    // Update theme when season changes (check every hour)
    const updateSeason = () => {
      const currentSeason = getCurrentSeason();
      if (currentSeason !== season) {
        setSeason(currentSeason);
        setTheme(themes[currentSeason]);
      }
    };

    // Check immediately
    updateSeason();

    // Set up interval to check for season changes
    const interval = setInterval(updateSeason, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, [season]);

  return (
    <ThemeContext.Provider value={{ theme, season }}>
      <div className={`${season}-theme min-h-screen`}>{children}</div>
    </ThemeContext.Provider>
  );
}
