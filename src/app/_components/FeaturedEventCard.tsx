"use client";

import { Box, Card, CardContent, CardMedia, Typography, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import type { Event } from "~/types";

interface FeaturedEventCardProps {
  event: Event;
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

export default function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  const router = useRouter();

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
    <Card
      onClick={() => router.push(`/events/${event.id}`)}
      sx={{
        display: "flex",
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "none",
        bgcolor: "background.paper",
        height: "100%",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
          borderColor: "transparent",
        },
      }}
    >
      <CardMedia
        component="div"
        sx={{
          width: 120,
          flexShrink: 0,
          bgcolor: getCategoryColor(event.type),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
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
          <Typography variant="h4">🏃‍♂️</Typography>
        )}
      </CardMedia>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent sx={{ flex: "1 0 auto", p: 2, "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Typography
              component="div"
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                lineHeight: 1.3,
                mb: 0.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {event.name}
            </Typography>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
            <Chip 
              label={event.type} 
              size="small" 
              sx={{ 
                height: 20, 
                fontSize: "0.7rem",
                bgcolor: "rgba(0,0,0,0.05)" 
              }} 
            />
            <Typography variant="caption" color="text.secondary">
              {formatEventDate(event.date)}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            📍 {event.city}, {event.state}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
