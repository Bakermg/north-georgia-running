import "~/styles/globals.css";

import "@fontsource/poppins";
import "@fontsource/geologica";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ErrorBoundary } from "~/app/_components/error-boundary";
import { ThemeProvider } from "~/app/_components/theme-context";
import { MuiThemeWrapper } from "~/app/_components/MuiThemeProvider";
import { AuthProvider } from "~/app/_components/AuthProvider";

export const metadata: Metadata = {
  title: "North Georgia Running",
  description: "Discover running events in North Georgia",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#2c3e50",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeProvider>
            <MuiThemeWrapper>
              <AuthProvider>
                <TRPCReactProvider>{children}</TRPCReactProvider>
              </AuthProvider>
            </MuiThemeWrapper>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
