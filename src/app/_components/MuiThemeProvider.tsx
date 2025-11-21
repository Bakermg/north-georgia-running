"use client";

import * as React from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useTheme } from "./theme-context";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider as EmotionCacheProvider } from "@emotion/react";
import type { EmotionCache, Options as OptionsOfCreateCache } from "@emotion/cache";

// Logic for NextAppDirEmotionCacheProvider
// Adapted from https://github.com/garronej/tss-react/blob/main/src/next/appDir.tsx
export function NextAppDirEmotionCacheProvider(props: {
  options: OptionsOfCreateCache;
  CacheProvider?: (props: {
    value: EmotionCache;
    children: React.ReactNode;
  }) => React.JSX.Element | null;
  children: React.ReactNode;
}) {
  const { options, CacheProvider = EmotionCacheProvider, children } = props;

  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    // eslint-disable-next-line no-restricted-syntax
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

interface MuiThemeWrapperProps {
  children: React.ReactNode;
}

// Anthropic-inspired professional color palette
const anthropicColors = {
  primary: "#1f2937", // dark gray (almost black)
  secondary: "#6b7280", // medium gray
  accent: "#3b82f6", // professional blue
  background: {
    default: "#ffffff", // pure white
    paper: "#f8fafc", // very light gray
    subtle: "#f1f5f9", // subtle background
  },
  text: {
    primary: "#1f2937", // dark gray for headings
    secondary: "#64748b", // medium gray for body
    muted: "#94a3b8", // light gray for muted text
  },
  border: "#e2e8f0", // light border
};

export function MuiThemeWrapper({ children }: MuiThemeWrapperProps) {
  const colors = anthropicColors;

  const muiTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: colors.primary,
        contrastText: "#ffffff",
      },
      secondary: {
        main: colors.secondary,
        contrastText: "#ffffff",
      },
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
      },
      grey: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
      },
    },
    typography: {
      fontFamily: "var(--font-body)",
      h1: {
        fontFamily: "var(--font-heading)",
        fontSize: "clamp(2rem, 9vw, 4rem)",
        fontWeight: 700,
        lineHeight: 1.1,
        color: colors.text.primary,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontFamily: "var(--font-heading)",
        fontSize: "clamp(1.5rem, 6.75vw, 3rem)",
        fontWeight: 700,
        lineHeight: 1.2,
        color: colors.text.primary,
        letterSpacing: "-0.01em",
      },
      h3: {
        fontFamily: "var(--font-heading)",
        fontSize: "clamp(1.25rem, 5vw, 2.25rem)",
        fontWeight: 700,
        lineHeight: 1.3,
        color: colors.text.primary,
        letterSpacing: "-0.01em",
      },
      h4: {
        fontFamily: "var(--font-heading)",
        fontSize: "clamp(1rem, 4vw, 1.75rem)",
        fontWeight: 700,
        lineHeight: 1.4,
        color: colors.text.primary,
      },
      h5: {
        fontFamily: "var(--font-heading)",
        fontSize: "clamp(0.875rem, 3.5vw, 1.5rem)",
        fontWeight: 700,
        lineHeight: 1.4,
        color: colors.text.primary,
      },
      h6: {
        fontFamily: "var(--font-heading)",
        fontSize: "clamp(0.75rem, 3vw, 1.25rem)",
        fontWeight: 700,
        lineHeight: 1.4,
        color: colors.text.primary,
      },
      body1: {
        fontFamily: "var(--font-body)",
        fontSize: "clamp(1rem, 2vw, 1.125rem)",
        lineHeight: 1.6,
        color: colors.text.primary,
        fontWeight: 400,
      },
      body2: {
        fontFamily: "var(--font-body)",
        fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
        lineHeight: 1.5,
        color: colors.text.secondary,
        fontWeight: 400,
      },
      button: {
        fontFamily: "var(--font-heading)",
        fontWeight: 600,
        textTransform: "none",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "6px",
            padding: "8px 16px",
            fontSize: "0.875rem",
            fontWeight: 500,
            boxShadow: "none",
            "&:hover": {
              boxShadow:
                "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            },
          },
          contained: {
            backgroundColor: colors.primary,
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#374151",
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 1px 3px 0 rgb(0 0 0 / 0.1)",
            },
          },
          outlined: {
            borderColor: colors.border,
            color: colors.text.primary,
            "&:hover": {
              backgroundColor: colors.background.subtle,
              borderColor: colors.secondary,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            border: `1px solid ${colors.border}`,
            boxShadow:
              "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            backgroundColor: colors.background.paper,
            transition: "box-shadow 0.2s ease-in-out",
            "&:hover": {
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.background.default,
            color: colors.text.primary,
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            borderBottom: `1px solid ${colors.border}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.border}`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              backgroundColor: colors.background.default,
              "& fieldset": {
                borderColor: colors.border,
              },
              "&:hover fieldset": {
                borderColor: colors.secondary,
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.accent,
              },
            },
          },
        },
      },
    },
  });

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
