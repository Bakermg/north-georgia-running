"use client";

import { Box, Container, Typography, Link as MuiLink } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#2c3e50",
        color: "#ffffff",
        py: { xs: 8, md: 12 },
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(4, 1fr)",
            },
            gap: { xs: 4, md: 6 },
            mb: 6,
          }}
        >
          {/* Brand Section */}
          <Box>
            <Box
              component="img"
              src="/logo-footer.svg"
              alt="North Georgia Running"
              sx={{
                height: 60,
                width: "auto",
                mb: 2,
                display: "block",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 1.6,
              }}
            >
              Discover and explore the best running events across North Georgia&apos;s
              beautiful mountains and trails.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#ffffff",
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink
                href="/"
                underline="hover"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#ffffff",
                  },
                }}
              >
                Home
              </MuiLink>
              <MuiLink
                href="/events"
                underline="hover"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#ffffff",
                  },
                }}
              >
                Browse Events
              </MuiLink>
              <MuiLink
                href="#"
                underline="hover"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#ffffff",
                  },
                }}
              >
                My Events
              </MuiLink>
            </Box>
          </Box>

          {/* Information */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#ffffff",
              }}
            >
              Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink
                href="#"
                underline="hover"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#ffffff",
                  },
                }}
              >
                About Us
              </MuiLink>
              <MuiLink
                href="#"
                underline="hover"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#ffffff",
                  },
                }}
              >
                Contact
              </MuiLink>
              <MuiLink
                href="#"
                underline="hover"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#ffffff",
                  },
                }}
              >
                Privacy Policy
              </MuiLink>
            </Box>
          </Box>

          {/* Connect */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#ffffff",
              }}
            >
              Connect
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink
                href="#"
                underline="hover"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#ffffff",
                  },
                }}
              >
                Facebook
              </MuiLink>
              <MuiLink
                href="#"
                underline="hover"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#ffffff",
                  },
                }}
              >
                Twitter
              </MuiLink>
              <MuiLink
                href="#"
                underline="hover"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#ffffff",
                  },
                }}
              >
                Instagram
              </MuiLink>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            pt: 4,
            mt: 4,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              textAlign: "center",
            }}
          >
            © 2024 North Georgia Running. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
