"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import Navigation from "~/app/_components/Navigation";
import EventsBanner from "~/app/events/_components/EventsBanner";
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
  CardHeader,
  Badge,
} from "~/app/_components/primitives";

// Helper functions to format dates
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

export default function EventDetailPage() {
  const params = useParams();
  const eventId = parseInt(params.id as string);

  const {
    data: event,
    isLoading,
    error,
  } = api.events.getById.useQuery(
    { id: eventId },
    { enabled: !isNaN(eventId) }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <EventsBanner />
        <Section>
          <Container>
            <Stack gap="lg">
              <div className="bg-error/10 border-l-4 border-error p-4 rounded">
                <Text color="error" weight="semibold">
                  {error?.message ?? "Event not found"}
                </Text>
              </div>
              <Link href="/events">
                <Button variant="outline">← Back to Events</Button>
              </Link>
            </Stack>
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
            {/* Back Button */}
            <Link href="/events">
              <Button variant="outline" size="sm">
                ← Back to Events
              </Button>
            </Link>

            {/* Event Card */}
            <Card>
              {/* Event Image */}
              {event.imageUrl && (
                <div className="h-96 w-full overflow-hidden bg-neutral-200">
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <CardContent className="py-8">
                <Stack gap="xl">
                  {/* Title and Badges */}
                  <Stack gap="md">
                    <Heading level="h1" fluid>
                      {event.name}
                    </Heading>
                    <Flex gap="md" className="flex-wrap">
                      <Badge variant="accent">
                        {event.type} • {event.distance}
                      </Badge>
                      {event.isVirtual && (
                        <Badge variant="secondary">Virtual Event</Badge>
                      )}
                    </Flex>
                  </Stack>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Description and Details */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* About Section */}
                      {event.description && (
                        <Stack gap="md">
                          <Heading level="h3" fluid>
                            About This Event
                          </Heading>
                          <div
                            className="prose prose-sm max-w-none text-secondary leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: event.description }}
                          />
                        </Stack>
                      )}

                      {/* Event Details */}
                      <Stack gap="md">
                        <Heading level="h4">Event Details</Heading>
                        <Stack gap="md" className="space-y-4">
                          {/* Date */}
                          <Flex gap="md" align="start">
                            <span className="text-lg">📅</span>
                            <Stack gap="xs">
                              <Text weight="semibold">Date</Text>
                              <Text color="secondary">
                                {formatEventDate(event.date)}
                              </Text>
                            </Stack>
                          </Flex>

                          {/* Time */}
                          <Flex gap="md" align="start">
                            <span className="text-lg">🕐</span>
                            <Stack gap="xs">
                              <Text weight="semibold">Time</Text>
                              <Text color="secondary">
                                {formatEventTime(event.date)}
                              </Text>
                            </Stack>
                          </Flex>

                          {/* Location */}
                          <Flex gap="md" align="start">
                            <span className="text-lg">📍</span>
                            <Stack gap="xs">
                              <Text weight="semibold">Location</Text>
                              <Text color="secondary">
                                {event.location}, {event.city}, {event.state}
                              </Text>
                            </Stack>
                          </Flex>

                          {/* Price */}
                          {event.price !== null && (
                            <Flex gap="md" align="start">
                              <span className="text-lg">💵</span>
                              <Stack gap="xs">
                                <Text weight="semibold">Entry Price</Text>
                                <Text color="secondary">
                                  ${event.price.toFixed(2)}
                                </Text>
                              </Stack>
                            </Flex>
                          )}
                        </Stack>
                      </Stack>
                    </div>

                    {/* Right Column - Action Card */}
                    <div className="lg:col-span-1">
                      <Card>
                        <CardHeader>
                          <Heading level="h5">Event Actions</Heading>
                        </CardHeader>
                        <CardContent>
                          <Stack gap="md">
                            {event.registrationLink && (
                              <a
                                href={event.registrationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full"
                              >
                                <Button
                                  variant="primary"
                                  size="lg"
                                  className="w-full"
                                >
                                  Register Now
                                </Button>
                              </a>
                            )}

                            {event.websiteUrl && (
                              <a
                                href={event.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full"
                              >
                                <Button
                                  variant="outline"
                                  size="lg"
                                  className="w-full"
                                >
                                  Visit Website
                                </Button>
                              </a>
                            )}

                            {!event.registrationLink && !event.websiteUrl && (
                              <Text size="sm" color="muted">
                                Registration information not available
                              </Text>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Section>
    </div>
  );
}
