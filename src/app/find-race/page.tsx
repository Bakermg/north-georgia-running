"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "~/trpc/react";
import Navigation from "~/app/_components/Navigation";
import Footer from "~/app/_components/Footer";
import RaceFinderBanner from "./_components/RaceFinderBanner";
import SearchResultCard from "./_components/SearchResultCard";
import AddRaceDialog from "./_components/AddRaceDialog";
import type { WebSearchResult, ParsedRaceDetails } from "~/server/services/raceSearchService";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Container,
  Card,
  CardContent,
  Skeleton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Skeleton Card for loading state
function SkeletonResultCard() {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8f9fa",
        mb: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="rounded" width={100} height={24} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="90%" height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="70%" height={28} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="85%" height={16} />
        <Skeleton variant="text" width="60%" height={16} sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Skeleton variant="rectangular" width="60%" height={36} />
          <Skeleton variant="rectangular" width="35%" height={36} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default function FindRacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<WebSearchResult | null>(null);
  const [loadingDetailsFor, setLoadingDetailsFor] = useState<string | null>(null);
  const [raceDetails, setRaceDetails] = useState<Record<string, ParsedRaceDetails>>({});
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());

  // Search query
  const searchResults = api.raceFinder.search.useQuery(
    { query: submittedQuery },
    {
      enabled: submittedQuery.length >= 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    }
  );

  // Fetch details query
  const fetchDetailsQuery = api.raceFinder.fetchRaceDetails.useQuery(
    { url: loadingDetailsFor ?? "" },
    {
      enabled: !!loadingDetailsFor,
      retry: false, // Don't retry on failure
    }
  );

  // Handle fetch details success/error with useEffect
  useEffect(() => {
    if (fetchDetailsQuery.data && loadingDetailsFor) {
      setRaceDetails((prev) => ({
        ...prev,
        [loadingDetailsFor]: fetchDetailsQuery.data,
      }));
      setLoadingDetailsFor(null);
    }
  }, [fetchDetailsQuery.data, loadingDetailsFor]);

  useEffect(() => {
    if (fetchDetailsQuery.error && loadingDetailsFor) {
      setFailedUrls((prev) => new Set(prev).add(loadingDetailsFor));
      setLoadingDetailsFor(null);
    }
  }, [fetchDetailsQuery.error, loadingDetailsFor]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3) {
      setSubmittedQuery(searchQuery.trim());
    }
  };

  const handleFetchDetails = useCallback((url: string) => {
    if (!raceDetails[url]) {
      setLoadingDetailsFor(url);
    }
  }, [raceDetails]);

  const handleAddToDatabase = (result: WebSearchResult) => {
    setSelectedResult(result);
    // Fetch details if not already loaded
    if (!raceDetails[result.url]) {
      handleFetchDetails(result.url);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedResult(null);
  };

  const results = searchResults.data ?? [];
  const isSearching = searchResults.isFetching;
  const hasSearched = submittedQuery.length >= 3;
  const searchError = searchResults.error;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Navigation />
      <RaceFinderBanner />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search Form */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <form onSubmit={handleSearch}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <TextField
                  fullWidth
                  label="Search for a race"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter race name (e.g., Peachtree Road Race)"
                  helperText="Enter at least 3 characters to search"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={searchQuery.trim().length < 3 || isSearching}
                  sx={{
                    mt: 1,
                    height: 56,
                    minWidth: 120,
                    backgroundColor: "#4a7c59",
                    "&:hover": {
                      backgroundColor: "#3d6548",
                    },
                  }}
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Error State */}
        {searchError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {searchError.message.includes("API key")
              ? "Search is not configured. Please add a Brave Search API key."
              : searchError.message.includes("rate limit")
              ? "Search limit reached. Please try again in a few minutes."
              : "Failed to search. Please try again."}
          </Alert>
        )}

        {/* Results Count */}
        {hasSearched && !isSearching && !searchError && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {results.length === 0
              ? `No results found for "${submittedQuery}"`
              : `Found ${results.length} result${results.length === 1 ? "" : "s"} for "${submittedQuery}"`}
          </Typography>
        )}

        {/* Loading State */}
        {isSearching && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 3,
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonResultCard key={`skeleton-${index}`} />
            ))}
          </Box>
        )}

        {/* Results Grid */}
        {!isSearching && results.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 3,
            }}
          >
            {results.map((result) => (
              <SearchResultCard
                key={result.url}
                result={result}
                details={raceDetails[result.url]}
                isLoadingDetails={loadingDetailsFor === result.url}
                hasFailed={failedUrls.has(result.url)}
                onFetchDetails={() => handleFetchDetails(result.url)}
                onAddToDatabase={() => handleAddToDatabase(result)}
              />
            ))}
          </Box>
        )}

        {/* Empty State */}
        {!isSearching && hasSearched && results.length === 0 && !searchError && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No races found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try different search terms or check the spelling.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Search tips:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Include the race name and location
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Try shorter or more specific keywords
              </Typography>
            </Box>
          </Box>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Search for a race to get started
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the name of a running event to search the web and find its
              details.
            </Typography>
          </Box>
        )}
      </Container>

      {/* Add Race Dialog */}
      <AddRaceDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        initialData={selectedResult ? raceDetails[selectedResult.url] : undefined}
      />

      <Footer />
    </Box>
  );
}
