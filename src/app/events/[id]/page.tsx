"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import Navigation from "~/app/_components/Navigation";
import EventsBanner from "~/app/events/_components/EventsBanner";

// Helper functions to format dates consistently (avoiding hydration issues)
function formatEventDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const weekday = weekdays[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  return `${weekday}, ${month} ${day}, ${year}`;
}

function formatEventTime(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${displayHours}:${minutes} ${ampm} UTC`;
}
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  DateRange,
  LocationOn,
  Bolt,
  AttachMoney,
  Public,
  CalendarToday,
} from "@mui/icons-material";
import Link from "next/link";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = parseInt(params.id as string);

  const {
    data: event,
    isLoading,
    error,
  } = api.events.getById.useQuery(
    { id: eventId },
    { enabled: !isNaN(eventId) },
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <Navigation />
        <EventsBanner />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.message ?? "Event not found"}
          </Alert>
          <Button component={Link} href="/events" variant="contained">
            Back to Events
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Navigation />
      <EventsBanner />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          component={Link}
          href="/events"
          variant="outlined"
          sx={{ mb: 3 }}
        >
          ← Back to Events
        </Button>

        <Card sx={{ mb: 4 }}>
          {event.imageUrl && (
            <CardMedia
              component="img"
              height="400"
              image={event.imageUrl}
              alt={event.name}
              sx={{ objectFit: "cover" }}
            />
          )}

          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              {event.name}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
              <Chip
                icon={<Bolt />}
                label={`${event.type} • ${event.distance}`}
                variant="outlined"
                color="primary"
              />
              {event.isVirtual && (
                <Chip
                  icon={<Public />}
                  label="Virtual Event"
                  variant="outlined"
                  color="secondary"
                />
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
              }}
            >
              <Box sx={{ flex: { xs: 1, md: 2 } }}>
                {event.description && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      About This Event
                    </Typography>
                    <Box
                      sx={{
                        lineHeight: 1.7,
                        "& p": { mb: 2 },
                        "& h1, & h2, & h3, & h4, & h5, & h6": {
                          fontWeight: "bold",
                          mt: 3,
                          mb: 2,
                          lineHeight: 1.3,
                        },
                        "& h1": { fontSize: "2rem" },
                        "& h2": { fontSize: "1.75rem" },
                        "& h3": { fontSize: "1.5rem" },
                        "& h4": { fontSize: "1.25rem" },
                        "& ul, & ol": { pl: 3, mb: 2 },
                        "& li": { mb: 1 },
                        "& a": {
                          color: "primary.main",
                          textDecoration: "underline",
                          "&:hover": { textDecoration: "none" },
                        },
                        "& strong, & b": { fontWeight: "bold" },
                        "& em, & i": { fontStyle: "italic" },
                        "& blockquote": {
                          borderLeft: "4px solid",
                          borderColor: "primary.main",
                          pl: 2,
                          py: 1,
                          my: 2,
                          bgcolor: "grey.50",
                          fontStyle: "italic",
                        },
                      }}
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  </Box>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CalendarToday color="action" />
                    <Typography variant="body1">
                      <strong>Date:</strong> {formatEventDate(event.date)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <DateRange color="action" />
                    <Typography variant="body1">
                      <strong>Time:</strong> {formatEventTime(event.date)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <LocationOn color="action" />
                    <Typography variant="body1">
                      <strong>Location:</strong> {event.location}, {event.city},{" "}
                      {event.state}
                    </Typography>
                  </Box>

                  {event.price !== null && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <AttachMoney color="action" />
                      <Typography variant="body1">
                        <strong>Price:</strong> ${event.price.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box sx={{ flex: { xs: 1, md: 1 } }}>
                <Card variant="outlined" sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Event Actions
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {event.registrationLink && (
                      <Button
                        variant="contained"
                        size="large"
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        fullWidth
                      >
                        Register Now
                      </Button>
                    )}

                    {event.websiteUrl && (
                      <Button
                        variant="outlined"
                        size="large"
                        href={event.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        fullWidth
                      >
                        Visit Website
                      </Button>
                    )}

                    {!event.registrationLink && !event.websiteUrl && (
                      <Typography variant="body2" color="text.secondary">
                        Registration information not available
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
