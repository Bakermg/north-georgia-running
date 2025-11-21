"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import Navigation from "~/app/_components/Navigation";
import Footer from "~/app/_components/Footer";
import SubmitEventForm from "~/app/_components/SubmitEventForm";
import EventsBanner from "~/app/events/_components/EventsBanner";
import EventCard from "~/app/events/_components/EventCard";
import type { Event } from "~/types";
import { useTheme } from "~/app/_components/theme-context";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Skeleton,
} from "@mui/material";

// Helper function to format dates consistently
function formatEventDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

// Skeleton Card Component for loading state
function SkeletonCard() {
  return (
    <Box
      sx={{
        color: "inherit",
        cursor: "pointer",
        breakInside: "avoid",
        marginBottom: 3,
        display: "inline-block",
        width: "100%",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          transition: "all 0.3s ease",
          bgcolor: "#f0f0f0",
        }}
      >
        {/* Image Skeleton */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={240}
          sx={{ bgcolor: "#e0e0e0" }}
        />

        {/* Content Skeleton */}
        <CardContent sx={{ p: 3 }}>
          {/* Category Tag Skeleton */}
          <Skeleton
            variant="rounded"
            width="100px"
            height={24}
            sx={{ mb: 2, bgcolor: "#e0e0e0" }}
          />

          {/* Title Skeleton */}
          <Skeleton
            variant="text"
            width="100%"
            height={28}
            sx={{ mb: 2, bgcolor: "#e0e0e0" }}
          />
          <Skeleton
            variant="text"
            width="80%"
            height={28}
            sx={{ mb: 2, bgcolor: "#e0e0e0" }}
          />

          {/* Date Skeleton */}
          <Skeleton
            variant="text"
            width="60%"
            height={20}
            sx={{ mb: 2, bgcolor: "#e0e0e0" }}
          />

          {/* Location/Distance Skeleton */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Skeleton
              variant="text"
              width="40%"
              height={16}
              sx={{ bgcolor: "#e0e0e0" }}
            />
            <Skeleton
              variant="text"
              width="35%"
              height={16}
              sx={{ bgcolor: "#e0e0e0" }}
            />
          </Box>
        </CardContent>

        {/* Actions Skeleton */}
        <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <Skeleton
            variant="rectangular"
            width="48%"
            height={36}
            sx={{ bgcolor: "#e0e0e0" }}
          />
          <Skeleton
            variant="rectangular"
            width="48%"
            height={36}
            sx={{ bgcolor: "#e0e0e0" }}
          />
        </CardActions>
      </Card>
    </Box>
  );
}

export default function EventsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  console.log("Current theme:", theme.name, "Primary:", theme.primary);
  console.log("Current theme:", theme.name, "Primary:", theme.primary);
  const [submitFormOpen, setSubmitFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    type: "",
    distance: "",
    dateFrom: "",
    dateTo: "",
  });

  const getFilteredEvents = api.events.getAll.useQuery(
    {
      ...filters,
      dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
      page: 1,
      limit: 50, // Show more results for filtered queries
    },
    {
      staleTime: 30 * 60 * 1000, // 30 minutes - keep data fresh longer
      gcTime: 60 * 60 * 1000, // 1 hour - keep in cache longer
      refetchOnWindowFocus: false, // Don't refetch when user switches tabs
    },
  );

  const { data: myEvents, refetch: refetchMyEvents } = api.userEvents.getMyEvents.useQuery(
    undefined,
    {
      enabled: true, // We can conditionally enable this if we checked session first, but trpc handles auth
    }
  );

  // Debug logging
  console.log("Query state:", {
    isLoading: getFilteredEvents.isLoading,
    isFetching: getFilteredEvents.isFetching,
    hasData: !!getFilteredEvents.data,
    eventCount: getFilteredEvents.data?.events?.length ?? 0,
    error: getFilteredEvents.error?.message,
    filters: filters,
  });

  const importEvents = api.events.importEvents.useMutation();

  const handleImport = () => {
    void importEvents.mutate(undefined, {
      onSuccess: (result) => {
        console.log("Import result:", result);
        void getFilteredEvents.refetch();
      },
      onError: (error) => {
        console.error("Error importing events:", error);
      },
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    console.log("Filter change:", key, "=", value);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterKeyDown = (e: React.KeyboardEvent) => {
    // Prevent form submission on Enter key
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const eventsData = getFilteredEvents.data ?? {
    events: [],
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0,
  };
  const { events, total } = eventsData;
  const typedEvents = events as Event[];

  // Show error state
  if (getFilteredEvents.error && !getFilteredEvents.data) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <Navigation />
        <EventsBanner />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load events. Please try again.
          </Alert>
          <Button onClick={() => getFilteredEvents.refetch()}>Retry</Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Navigation />
      <EventsBanner />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Box sx={{ flex: "1 1 300px" }}>
                  <TextField
                    fullWidth
                    label="Search Events"
                    value={filters.name}
                    onChange={(e) => handleFilterChange("name", e.target.value)}
                    onKeyDown={handleFilterKeyDown}
                    placeholder="Search by event name..."
                  />
                </Box>

                <Box sx={{ flex: "1 1 300px" }}>
                  <TextField
                    fullWidth
                    label="City"
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                    onKeyDown={handleFilterKeyDown}
                    placeholder="Filter by city..."
                  />
                </Box>

                <Box sx={{ flex: "1 1 300px" }}>
                  <FormControl fullWidth>
                    <InputLabel>Event Type</InputLabel>
                    <Select
                      value={filters.type}
                      onChange={(e) =>
                        handleFilterChange("type", e.target.value)
                      }
                      label="Event Type"
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="5K">5K</MenuItem>
                      <MenuItem value="10K">10K</MenuItem>
                      <MenuItem value="Half Marathon">Half Marathon</MenuItem>
                      <MenuItem value="Marathon">Marathon</MenuItem>
                      <MenuItem value="Trail Run">Trail Run</MenuItem>
                      <MenuItem value="Ultra Marathon">Ultra Marathon</MenuItem>
                      <MenuItem value="Virtual">Virtual</MenuItem>
                      <MenuItem value="Running Event">Running Event</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: "1 1 300px" }}>
                  <FormControl fullWidth>
                    <InputLabel>Distance</InputLabel>
                    <Select
                      value={filters.distance}
                      onChange={(e) =>
                        handleFilterChange("distance", e.target.value)
                      }
                      label="Distance"
                    >
                      <MenuItem value="">All Distances</MenuItem>
                      <MenuItem value="5K">5K</MenuItem>
                      <MenuItem value="10K">10K</MenuItem>
                      <MenuItem value="Half Marathon">Half Marathon</MenuItem>
                      <MenuItem value="Marathon">Marathon</MenuItem>
                      <MenuItem value="Trail">Trail</MenuItem>
                      <MenuItem value="Various">Various</MenuItem>
                      <MenuItem value="Virtual">Virtual</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: "1 1 300px" }}>
                  <TextField
                    fullWidth
                    label="Date From"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    onKeyDown={handleFilterKeyDown}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <Box sx={{ flex: "1 1 300px" }}>
                  <TextField
                    fullWidth
                    label="Date To"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    onKeyDown={handleFilterKeyDown}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => setSubmitFormOpen(true)}
                sx={{
                  backgroundColor: "#d97757",
                  color: "#ffffff",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#c45a43",
                  },
                }}
              >
                Submit Your Event
              </Button>
            </CardActions>
          </Card>

          <Typography variant="body2" color="text.secondary">
            {getFilteredEvents.isFetching
              ? "Loading filtered results..."
              : `Showing ${events.length} of ${total} events`}
          </Typography>
        </Box>

        <Box
          sx={{
            columnCount: {
              xs: 1,
              sm: 2,
              md: 3,
            },
            columnGap: 3,
          }}
        >
          {/* Show skeleton cards while initially loading or fetching filtered results */}
          {(getFilteredEvents.isLoading && !getFilteredEvents.data) || getFilteredEvents.isFetching ? (
            <>
              {Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))}
            </>
          ) : (
            typedEvents.map((event: Event) => {
              const isRegistered = myEvents?.some((e) => e.eventId === event.id) ?? false;
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={isRegistered}
                  onToggle={() => void refetchMyEvents()}
                />
              );
            })
          )}
        </Box>

        {!getFilteredEvents.isFetching && events.length === 0 && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Alert severity="info" sx={{ mb: 2, maxWidth: 400, mx: "auto" }}>
              No events found
            </Alert>
            <Button
              type="button"
              variant="contained"
              onClick={handleImport}
              disabled={importEvents.isPending}
            >
              {importEvents.isPending ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Importing...
                </>
              ) : (
                "Import Events"
              )}
            </Button>
          </Box>
        )}
      </Container>

      {/* Submit Event Form Dialog */}
      <SubmitEventForm
        open={submitFormOpen}
        onClose={() => setSubmitFormOpen(false)}
      />

      <Footer />
    </Box>
  );
}
