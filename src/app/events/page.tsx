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
import {
  Container,
  Section,
  Stack,
  Flex,
  Heading,
  Paragraph,
  Text,
  Button,
  Card,
  CardContent,
  CardFooter,
  Input,
  Select,
} from "~/app/_components/primitives";

// Skeleton Loading Card
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <Card>
        <div className="h-48 bg-neutral-200 rounded-t-lg" />
        <CardContent className="space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-24" />
          <div className="h-6 bg-neutral-200 rounded w-full" />
          <div className="h-4 bg-neutral-200 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-3 bg-neutral-200 rounded w-full" />
            <div className="h-3 bg-neutral-200 rounded w-5/6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EventsPage() {
  const router = useRouter();
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
      limit: 50,
    },
    {
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  const { data: myEvents, refetch: refetchMyEvents } = api.userEvents.getMyEvents.useQuery(
    undefined,
    { enabled: true }
  );

  const importEvents = api.events.importEvents.useMutation();

  const handleImport = () => {
    void importEvents.mutate(undefined, {
      onSuccess: () => void getFilteredEvents.refetch(),
      onError: (error) => console.error("Error importing events:", error),
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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

  // Error state
  if (getFilteredEvents.error && !getFilteredEvents.data) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <EventsBanner />
        <Section>
          <Container>
            <div className="bg-error/10 border-l-4 border-error p-4 rounded">
              <Text color="error" weight="semibold">
                Failed to load events. Please try again.
              </Text>
              <Button
                variant="outline"
                size="sm"
                onClick={() => getFilteredEvents.refetch()}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <EventsBanner />

      <Section>
        <Container>
          <Stack gap="xl">
            {/* Filter Section */}
            <Card>
              <CardContent>
                <Stack gap="lg">
                  {/* Filter Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                      label="Search Events"
                      placeholder="Search by event name..."
                      value={filters.name}
                      onChange={(e) => handleFilterChange("name", e.target.value)}
                    />

                    <Input
                      label="City"
                      placeholder="Filter by city..."
                      value={filters.city}
                      onChange={(e) => handleFilterChange("city", e.target.value)}
                    />

                    <Select
                      label="Event Type"
                      placeholder="Choose event type"
                      value={filters.type}
                      onChange={(e) => handleFilterChange("type", e.target.value)}
                      options={[
                        { value: "5K", label: "5K" },
                        { value: "10K", label: "10K" },
                        { value: "Half Marathon", label: "Half Marathon" },
                        { value: "Marathon", label: "Marathon" },
                        { value: "Trail Run", label: "Trail Run" },
                        { value: "Ultra Marathon", label: "Ultra Marathon" },
                        { value: "Virtual", label: "Virtual" },
                        { value: "Running Event", label: "Running Event" },
                      ]}
                    />

                    <Select
                      label="Distance"
                      placeholder="Choose distance"
                      value={filters.distance}
                      onChange={(e) => handleFilterChange("distance", e.target.value)}
                      options={[
                        { value: "5K", label: "5K" },
                        { value: "10K", label: "10K" },
                        { value: "Half Marathon", label: "Half Marathon" },
                        { value: "Marathon", label: "Marathon" },
                        { value: "Trail", label: "Trail" },
                        { value: "Various", label: "Various" },
                        { value: "Virtual", label: "Virtual" },
                      ]}
                    />

                    <Input
                      label="Date From"
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                    />

                    <Input
                      label="Date To"
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                    />
                  </div>

                  {/* Results Count */}
                  <Text size="sm" color="muted">
                    {getFilteredEvents.isFetching
                      ? "Loading filtered results..."
                      : `Showing ${events.length} of ${total} events`}
                  </Text>
                </Stack>
              </CardContent>

              <CardFooter>
                <Flex justify="end" gap="md">
                  <Button
                    variant="primary"
                    onClick={() => setSubmitFormOpen(true)}
                  >
                    Submit Your Event
                  </Button>
                </Flex>
              </CardFooter>
            </Card>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(getFilteredEvents.isLoading && !getFilteredEvents.data) ||
              getFilteredEvents.isFetching ? (
                Array.from({ length: 12 }).map((_, index) => (
                  <SkeletonCard key={`skeleton-${index}`} />
                ))
              ) : typedEvents.length > 0 ? (
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
              ) : (
                <div className="col-span-full py-12 text-center">
                  <Stack gap="lg">
                    <Heading level="h3">No events found</Heading>
                    <Paragraph color="secondary">
                      Try adjusting your filters or import new events
                    </Paragraph>
                    <Button
                      variant="primary"
                      onClick={handleImport}
                      disabled={importEvents.isPending}
                    >
                      {importEvents.isPending ? "Importing..." : "Import Events"}
                    </Button>
                  </Stack>
                </div>
              )}
            </div>
          </Stack>
        </Container>
      </Section>

      {/* Submit Event Form Dialog */}
      <SubmitEventForm
        open={submitFormOpen}
        onClose={() => setSubmitFormOpen(false)}
      />

      <Footer />
    </div>
  );
}
