"use client";

import { Box, Typography, Container } from "@mui/material";
import { useTheme } from "~/app/_components/theme-context";

export function HomeBanner() {
  const { theme } = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: "#f5f0eb",
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
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "#d97757" }}
            >
              {/* Mountain peaks */}
              <path
                d="M10 80l8-15 7 10 8-20 6 12 8-18 5 8 7-12 6 15 8-22 4 6 6-10 5 18 7-25 3 5 5-8 4 12 6-16 2 4 4-6 3 9 5-13 1 3 3-5 2 7 4-9 0 2 2-4 1 6 3-8-1 1 1-2 0 4 2-6-2 0 0-1-1 3 1-4-3-1-1 2 0-3-2 1 1-2-4-2-2 4 3-6-5-1-3 5 4-8-6-2-4 6 5-10-7-3-5 7 6-12-8-4-6 8 7-14-9-5-7 9 8-16-10-6-8 10 9-18-11-7-9 11 10-20-12-8-10 12 11-22-13-9-11 13 12-24-14-10-12 14 13-26-15-11-13 15 14-28-16-12-14 16 15-30-17-13-15 17 16-32-18-14-16 18 17-34-19-15-17 19 18-36-20-16-18 20 19-38-21-17-19 21 20-40-22-18-20 22 21-42-23-19-21 23 22-44-24-20-22 24 23-46-25-21-23 25 24-48-26-22-24 26 25-50-27-23-25 27 26-52-28-24-26 28 27-54-29-25-27 29 28-56-30-26-28 30 29-58-31-27-29 31 30-60-32-28-30 32 31-62-33-29-31 33 32-64-34-30-32 34 33-66-35-31-33 35 34-68-36-32-34 36 35-70-37-33-35 37 36-72-38-34-36 38 37-74-39-35-37 39 38-76-40-36-38 40 39-78-41-37-39 41 40-80-42-38-40 42 41-82-43-39-41 43 42-84-44-40-42 44 43-86-45-41-43 45 44-88-46-42-44 46 45-90-47-43-45 47 46-92-48-44-46 48 47-94-49-45-47 49 48-96-50-46-48 50 49-98-51-47-49 51 50-100-52-48-50 52"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.3"
              />
              {/* Running figure */}
              <path
                d="M55 45c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7zm-5.4 8.1c-.7 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4zm10.8 0c-.7 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4zM49.3 58.1c-.7 0-1.4.6-1.4 1.4v5.4c0 .7.6 1.4 1.4 1.4s1.4-.6 1.4-1.4v-5.4c0-.7-.6-1.4-1.4-1.4zm10.8 0c-.7 0-1.4.6-1.4 1.4v5.4c0 .7.6 1.4 1.4 1.4s1.4-.6 1.4-1.4v-5.4c0-.7-.6-1.4-1.4-1.4z"
                fill="currentColor"
                opacity="0.8"
              />
              {/* Running path */}
              <path
                d="M35 65l5.4-5.4 2.7 2.7 5.4-8.1 2.7 4.1 5.4-6.8 2.7 5.4 2.7-4.1"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
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
              North Georgia Running
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
              Your gateway to the best running events in North Georgia
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
              Explore • Connect • Achieve
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
