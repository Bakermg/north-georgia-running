"use client";

import {
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";
import type { WebSearchResult, ParsedRaceDetails } from "~/server/services/raceSearchService";

interface SearchResultCardProps {
  result: WebSearchResult;
  details?: ParsedRaceDetails;
  isLoadingDetails: boolean;
  hasFailed?: boolean;
  onAddToDatabase: () => void;
  onFetchDetails: () => void;
}

export default function SearchResultCard({
  result,
  details,
  isLoadingDetails,
  hasFailed = false,
  onAddToDatabase,
  onFetchDetails,
}: SearchResultCardProps) {
  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return "Date TBD";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "all 0.3s ease",
        bgcolor: "#f8f9fa",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ p: 3, flex: 1 }}>
        {/* Source Badge */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Chip
            label={result.source}
            size="small"
            sx={{
              bgcolor: "rgba(0, 0, 0, 0.08)",
              fontWeight: 600,
              textTransform: "lowercase",
              fontSize: "0.7rem",
            }}
          />
          {result.isRaceSite && (
            <Chip
              label="Official Race Site"
              size="small"
              sx={{
                bgcolor: "rgba(76, 175, 80, 0.15)",
                color: "#2e7d32",
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            />
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            lineHeight: 1.3,
            color: "#1f2937",
          }}
        >
          {result.title}
        </Typography>

        {/* Snippet */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {result.snippet}
        </Typography>

        {/* Parsed Details Section - Only for race sites */}
        {result.isRaceSite && (
          <>
            {isLoadingDetails ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Extracting race details...
                </Typography>
              </Box>
            ) : hasFailed ? (
              <Typography
                variant="body2"
                sx={{ mt: 2, color: "text.secondary", fontStyle: "italic" }}
              >
                Could not auto-extract details. You can still submit this race manually.
              </Typography>
            ) : details ? (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "rgba(76, 175, 80, 0.08)",
                  borderRadius: 1,
                  borderLeft: "3px solid #4caf50",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Extracted Details
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {details.date && (
                    <Typography variant="body2" color="text.secondary">
                      📅 {formatDate(details.date)}
                    </Typography>
                  )}
                  {details.location && (
                    <Typography variant="body2" color="text.secondary">
                      📍 {details.location}
                    </Typography>
                  )}
                  {details.distance && (
                    <Typography variant="body2" color="text.secondary">
                      🏁 {details.distance}
                    </Typography>
                  )}
                  {details.type && (
                    <Typography variant="body2" color="text.secondary">
                      🏃 {details.type}
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Button
                size="small"
                variant="text"
                onClick={onFetchDetails}
                sx={{ mt: 1, textTransform: "none" }}
              >
                Load race details
              </Button>
            )}
          </>
        )}
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
        {result.isRaceSite && (
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddToDatabase}
            sx={{
              flexGrow: 1,
              backgroundColor: "#4a7c59",
              "&:hover": {
                backgroundColor: "#3d6548",
              },
            }}
          >
            Submit This Race
          </Button>
        )}
        <Button
          size="small"
          variant={result.isRaceSite ? "outlined" : "contained"}
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
          sx={!result.isRaceSite ? { flexGrow: 1 } : undefined}
        >
          Visit Site
        </Button>
      </CardActions>
    </Card>
  );
}
