"use client";

import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import type { Event } from "~/types";
import { useSession } from "next-auth/react";

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  onToggle: () => void;
}

// Helper function to format dates consistently
function formatEventDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

export default function EventCard({ event, isRegistered, onToggle }: EventCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const utils = api.useUtils();

  const toggleMutation = api.userEvents.toggle.useMutation({
    onSuccess: () => {
      onToggle();
      void utils.userEvents.getMyEvents.invalidate();
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      // Redirect to login or show message? For now, just do nothing or maybe alert
      // ideally we should open the login modal or redirect
      return;
    }
    toggleMutation.mutate({ eventId: event.id });
  };

  // Helper function to get category color
  const getCategoryColor = (type: string) => {
    const colors: Record<string, string> = {
      "5K": "#e3d5ca",
      "10K": "#d9e8f5",
      "Half Marathon": "#f5e6d3",
      Marathon: "#fadadd",
      "Trail Run": "#c8e6c9",
      "Ultra Marathon": "#e1bee7",
      Virtual: "#b3e5fc",
      "Running Event": "#ffecb3",
    };
    return colors[type] ?? "#e0e0e0";
  };

  return (
    <Box
      onClick={() => router.push(`/events/${event.id}`)}
      sx={{
        color: "inherit",
        cursor: "pointer",
        breakInside: "avoid",
        marginBottom: 3,
        display: "inline-block",
        width: "100%",
        "&:hover .event-card": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        "&:hover .event-title": {
          color: "primary.main",
        },
      }}
    >
      <Card
        className="event-card"
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          transition: "all 0.3s ease",
          bgcolor: getCategoryColor(event.type),
        }}
      >
        {/* Image Section */}
        <CardMedia
          component="div"
          sx={{
            height: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.5)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {event.imageUrl ? (
            <Box
              component="img"
              src={event.imageUrl}
              alt={event.name}
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography variant="h1" sx={{ fontSize: "4rem" }}>
              🏃‍♂️
            </Typography>
          )}
          
          {/* Save Button Overlay */}
          {session && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10,
              }}
            >
              <Tooltip title={isRegistered ? "Remove from my events" : "Save event"}>
                <IconButton
                  onClick={handleToggle}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.95)",
                    },
                  }}
                >
                  {isRegistered ? (
                    <BookmarkIcon color="primary" />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </CardMedia>

        {/* Content Section */}
        <CardContent sx={{ p: 3 }}>
          {/* Category Tag */}
          <Box
            sx={{
              display: "inline-block",
              px: 1.5,
              py: 0.5,
              mb: 2,
              bgcolor: "rgba(0, 0, 0, 0.08)",
              borderRadius: 1,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              fontSize: "0.75rem",
            }}
          >
            {event.type}
          </Box>

          {/* Event Title */}
          <Typography
            className="event-title"
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              lineHeight: 1.3,
              transition: "color 0.3s ease",
            }}
          >
            {event.name}
          </Typography>

          {/* Date */}
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 2,
              fontWeight: 500,
            }}
          >
            {formatEventDate(event.date)}
          </Typography>

          {/* Location and Distance */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="body2" color="text.secondary">
              📍 {event.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              🏁 {event.distance}
            </Typography>
          </Box>
        </CardContent>

        {/* Action Buttons */}
        <CardActions
          sx={{
            px: 3,
            pb: 3,
            pt: 0,
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {event.registrationLink && (
            <Button
              size="small"
              variant="contained"
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              sx={{ flexGrow: 1 }}
            >
              Register
            </Button>
          )}
          {event.websiteUrl && (
            <Button
              size="small"
              variant="outlined"
              href={event.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Website
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
