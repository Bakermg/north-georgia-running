"use client";

import { Box, Typography, Container } from "@mui/material";
import { useTheme } from "~/app/_components/theme-context";

export default function EventsBanner() {
  const { theme } = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: "#d9e8f5",
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 4, md: 6 },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* SVG Icon - Left Side */}
          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <svg
              width="240"
              height="240"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "#5b7a9e" }}
            >
              {/* Running figure silhouette */}
              <path
                d="M40 15c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-8 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm16 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM32 35c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2v-8c0-1.1-.9-2-2-2zm16 0c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2v-8c0-1.1-.9-2-2-2zM28 51c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2zm24 0c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2z"
                fill="currentColor"
                opacity="0.6"
              />
              {/* Running path lines */}
              <path
                d="M20 45l8-8 4 4 8-12 4 6 8-10 4 8 4-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Mountain peaks in background */}
              <path
                d="M10 60l5-10 5 8 5-12 5 6 5-8 5 4 5-6 5 2 5-4 5 6 5-8 5 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.4"
              />
            </svg>
          </Box>

          {/* Content - Right Side */}
          <Box sx={{ flex: 1 }}>
            {/* Title */}
            <Typography
              variant="h1"
              sx={{
                mb: 3,
                fontWeight: 700,
                lineHeight: 1.2,
                color: "#2c2c2c",
              }}
            >
              North Georgia Running Events
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 400,
                lineHeight: 1.5,
                color: "rgba(0, 0, 0, 0.7)",
              }}
            >
              Discover races, marathons, and running events in North Georgia
            </Typography>

            {/* Tagline */}
            <Typography
              variant="body2"
              sx={{
                color: "rgba(0, 0, 0, 0.5)",
                letterSpacing: 0.5,
                fontWeight: 500,
              }}
            >
              Explore • Discover • Participate
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
