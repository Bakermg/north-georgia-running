"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Navigation from "~/app/_components/Navigation";
import Footer from "~/app/_components/Footer";
import SubmitEventForm from "~/app/_components/SubmitEventForm";
import { HomeBanner } from "~/app/_components/HomeBanner";
import { useTheme } from "~/app/_components/theme-context";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import { Search } from "@mui/icons-material";

export default function HomePage() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [submitFormOpen, setSubmitFormOpen] = useState(false);

  const { data: eventsData } = api.events.getAll.useQuery(
    {
      page: 1,
      limit: 1,
    },
    {
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  const eventCount = eventsData?.total ?? 0;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Search logic would go here
    setTimeout(() => setIsSearching(false), 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") void handleSearch();
  };

  return (
    <Box>
      <Navigation />

      <HomeBanner />

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: "background.default",
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
            <Typography
              variant="h3"
              sx={{
                mb: 3,
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Discover North Georgia Running
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 6,
                maxWidth: 600,
                mx: "auto",
                color: "text.secondary",
                lineHeight: 1.6,
              }}
            >
              Find your next running adventure in the beautiful mountains and
              trails of North Georgia
            </Typography>
          </Box>

          {/* Core Views Style Callouts - Mosaic Layout */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(12, 1fr)",
              },
              gap: { xs: 3, md: 3 },
            }}
          >
            {/* Active Events - Large Featured Card */}
            <Box
              sx={{
                gridColumn: { xs: "1", md: "span 8" },
                backgroundColor: "#f5e6d3",
                borderRadius: 3,
                p: { xs: 4, md: 6 },
                color: "#2c2c2c",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: { md: "280px" },
                border: "1px solid rgba(0, 0, 0, 0.06)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: "rgba(0, 0, 0, 0.5)",
                  fontWeight: 600,
                  letterSpacing: 1,
                  mb: 2,
                }}
              >
                Featured
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: "#d97757",
                }}
              >
                {eventCount}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: "#2c2c2c",
                }}
              >
                Active Events
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.7,
                  color: "#2c2c2c",
                }}
              >
                Running events happening right now across North Georgia
              </Typography>
            </Box>

            {/* Cities Card - Tall */}
            <Box
              sx={{
                gridColumn: { xs: "1", md: "span 4" },
                gridRow: { md: "span 2" },
                backgroundColor: "#d9e8f5",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: 3,
                p: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                  color: "#5b7a9e",
                }}
              >
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Mountain ranges */}
                  <path
                    d="M8 32L16 16L24 26L32 8L40 22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Cities represented as small buildings */}
                  <rect x="6" y="34" width="4" height="8" fill="currentColor" opacity="0.8" />
                  <rect x="12" y="36" width="4" height="6" fill="currentColor" opacity="0.6" />
                  <rect x="26" y="34" width="4" height="8" fill="currentColor" opacity="0.7" />
                  <rect x="34" y="36" width="4" height="6" fill="currentColor" opacity="0.5" />
                  <rect x="42" y="38" width="4" height="4" fill="currentColor" opacity="0.4" />
                  {/* Connecting paths */}
                  <path
                    d="M8 38H44"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                </svg>
              </Box>
              <Typography
                variant="h5"
                sx={{ mb: 2, fontWeight: 600, color: "#2c2c2c", textAlign: "center" }}
              >
                25+ Cities
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(0, 0, 0, 0.65)",
                  lineHeight: 1.6,
                  textAlign: "center",
                }}
              >
                Events across the diverse landscapes of North Georgia, from
                mountain towns to lakeside communities
              </Typography>
            </Box>

            {/* All Distances Card - Wide */}
            <Box
              sx={{
                gridColumn: { xs: "1", md: "span 5" },
                backgroundColor: "#c8e6c9",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: 3,
                p: 4,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  color: "#5a8f5c",
                }}
              >
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 42 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Start circle */}
                  <circle cx="6" cy="30" r="3" fill="currentColor" opacity="0.8" />
                  {/* Finish flag */}
                  <path
                    d="M36 6V16H30V10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Race route with varying distances */}
                  <path
                    d="M9 28C12 24 15 22 18 22C21 22 24 26 27 18C30 12 32 14 35 10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.7"
                  />
                  {/* Distance markers along the route */}
                  <circle cx="18" cy="22" r="2" fill="currentColor" opacity="0.5" />
                  <circle cx="27" cy="18" r="2" fill="currentColor" opacity="0.6" />
                </svg>
              </Box>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#2c2c2c" }}
              >
                All Distances
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(0, 0, 0, 0.65)", lineHeight: 1.6 }}
              >
                From fun 5K runs to challenging marathons, find events that
                match your fitness level and goals
              </Typography>
            </Box>

            {/* Live Updates Card */}
            <Box
              sx={{
                gridColumn: { xs: "1", md: "span 3" },
                backgroundColor: "#fadadd",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: 3,
                p: 4,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  color: "#c97a7e",
                }}
              >
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 42 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Center notification circle */}
                  <circle cx="21" cy="21" r="6" fill="currentColor" opacity="0.8" />
                  {/* Notification bell-like shape */}
                  <path
                    d="M15 24C15 24 13 28 21 30C29 28 27 24 27 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Live waves - broadcasting signals */}
                  <circle
                    cx="21"
                    cy="21"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.5"
                  />
                  <circle
                    cx="21"
                    cy="21"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.3"
                  />
                  {/* Small accent dots */}
                  <circle cx="18" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
                  <circle cx="33" cy="16" r="1.5" fill="currentColor" opacity="0.5" />
                </svg>
              </Box>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600, color: "#2c2c2c" }}
              >
                Live Updates
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(0, 0, 0, 0.65)", lineHeight: 1.6 }}
              >
                Real-time event information with up-to-date registration links
                and event details
              </Typography>
            </Box>
          </Box>

          {/* Informative Content Section */}
          <Box sx={{ mb: { xs: 6, md: 10 }, textAlign: "center", maxWidth: 800, mx: "auto" }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: "text.primary" }}>
              Experience the Mountains
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, fontSize: "1.125rem", color: "text.secondary", lineHeight: 1.8 }}>
              North Georgia offers some of the most scenic and challenging running routes in the Southeast. 
              From the rolling hills of the Piedmont to the rugged trails of the Blue Ridge Mountains, 
              there's a path for every runner. Whether you're training for your first 5K or an ultra-marathon, 
              our community is here to support your journey.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.125rem", color: "text.secondary", lineHeight: 1.8 }}>
              Join us in exploring the hidden gems, historic towns, and breathtaking vistas that make 
              running in North Georgia truly unique.
            </Typography>
          </Box>


        </Container>
      </Box>

      {/* Event Submission CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: "#eef2f6",
          color: "#2c3e50",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
              }}
            >
              Have a Running Event?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: "text.secondary",
                fontWeight: 400,
                fontSize: { xs: "1rem", md: "1.125rem" },
              }}
            >
              Help runners discover your event! Submit your race, marathon, or
              running event to our growing calendar.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => setSubmitFormOpen(true)}
              sx={{
                backgroundColor: "#d97757",
                color: "#ffffff",
                px: 6,
                py: 1.5,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#c45a43",
                },
              }}
            >
              Submit Your Event
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Submit Event Form Dialog */}
      <SubmitEventForm
        open={submitFormOpen}
        onClose={() => setSubmitFormOpen(false)}
      />

      <Footer />
    </Box>
  );
}
