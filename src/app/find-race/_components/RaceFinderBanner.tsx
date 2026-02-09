"use client";

import { Box, Typography, Container } from "@mui/material";

export default function RaceFinderBanner() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: "#e8f5e9",
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
              width="200"
              height="200"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "#4a7c59" }}
            >
              {/* Magnifying glass */}
              <circle
                cx="35"
                cy="35"
                r="18"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
              <line
                x1="48"
                y1="48"
                x2="62"
                y2="62"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Running figure inside magnifying glass */}
              <path
                d="M35 24c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z"
                fill="currentColor"
              />
              <path
                d="M31 32l3 2 2-3 3 4 2-2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M29 40l3-4 2 2 3-3 2 3 2-2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Small decorative elements */}
              <circle cx="15" cy="20" r="2" fill="currentColor" opacity="0.3" />
              <circle cx="60" cy="25" r="1.5" fill="currentColor" opacity="0.3" />
              <circle cx="20" cy="55" r="1.5" fill="currentColor" opacity="0.3" />
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
              Find Your Race
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
              Search the web for running events and add them to our database
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
              Search • Discover • Submit
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
