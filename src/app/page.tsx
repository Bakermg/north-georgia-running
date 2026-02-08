"use client";

import { useState } from "react";
import Navigation from "~/app/_components/Navigation";
import Footer from "~/app/_components/Footer";
import SubmitEventForm from "~/app/_components/SubmitEventForm";
import { HomeBanner } from "~/app/_components/HomeBanner";
import { api } from "~/trpc/react";
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
} from "~/app/_components/primitives";

export default function HomePage() {
  const [submitFormOpen, setSubmitFormOpen] = useState(false);

  // Fetch event count
  const { data: eventsData } = api.events.getAll.useQuery(
    { page: 1, limit: 1 },
    {
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  const eventCount = eventsData?.total ?? 0;

  return (
    <div className="bg-neutral-50">
      <Navigation />
      <HomeBanner />

      {/* Main Content Section */}
      <Section py="2xl">
        <Container>
          <Stack gap="xl">
            {/* Hero Text */}
            <Stack gap="lg" className="text-center">
              <Heading level="h2" fluid>
                Discover
              </Heading>
              <Paragraph color="secondary" fluid className="max-w-2xl mx-auto">
                Find your next running adventure in the beautiful mountains and
                trails of North Georgia
              </Paragraph>
            </Stack>

            {/* Feature Grid - Mosaic Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Active Events - Large Featured Card */}
              <Card
                interactive
                className="md:col-span-8"
                style={{ background: "linear-gradient(to bottom right, rgba(245, 173, 114, 0.3), rgb(250, 248, 246)) !important" }}
              >
                <CardContent className="py-8 md:py-12 rounded-t-lg rounded-b-lg bg-transparent">
                  <Stack gap="md">
                    <Text size="xs" color="muted" weight="semibold">
                      FEATURED
                    </Text>
                    <Heading level="h2" size="5xl" color="accent">
                      {eventCount}
                    </Heading>
                    <Heading level="h3">Active Events</Heading>
                    <Paragraph color="secondary">
                      Running events happening right now across North Georgia
                    </Paragraph>
                  </Stack>
                </CardContent>
              </Card>

              {/* Cities Card - Tall */}
              <Card
                interactive
                className="md:col-span-4 md:row-span-2"
                style={{ background: "linear-gradient(to bottom right, rgba(217, 119, 87, 0.3), rgb(250, 248, 246)) !important" }}
              >
                <CardContent className="py-8 text-center rounded-t-lg rounded-b-lg bg-transparent">
                  <Stack gap="lg" className="items-center">
                    <div className="w-20 h-20 mx-auto bg-neutral-200 rounded-lg flex items-center justify-center">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-secondary"
                      >
                        <path
                          d="M8 32L16 16L24 26L32 8L40 22"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                        <rect
                          x="6"
                          y="34"
                          width="4"
                          height="8"
                          fill="currentColor"
                          opacity="0.8"
                        />
                        <rect
                          x="12"
                          y="36"
                          width="4"
                          height="6"
                          fill="currentColor"
                          opacity="0.6"
                        />
                        <rect
                          x="26"
                          y="34"
                          width="4"
                          height="8"
                          fill="currentColor"
                          opacity="0.7"
                        />
                        <rect
                          x="34"
                          y="36"
                          width="4"
                          height="6"
                          fill="currentColor"
                          opacity="0.5"
                        />
                        <rect
                          x="42"
                          y="38"
                          width="4"
                          height="4"
                          fill="currentColor"
                          opacity="0.4"
                        />
                        <path
                          d="M8 38H44"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          opacity="0.3"
                        />
                      </svg>
                    </div>
                    <Heading level="h5">25+ Cities</Heading>
                    <Paragraph color="secondary" size="sm">
                      Events across the diverse landscapes of North Georgia, from
                      mountain towns to lakeside communities
                    </Paragraph>
                  </Stack>
                </CardContent>
              </Card>

              {/* All Distances Card - Wide */}
              <Card
                interactive
                className="md:col-span-5"
                style={{ background: "linear-gradient(to bottom right, rgba(155, 149, 144, 0.3), rgb(250, 248, 246)) !important" }}
              >
                <CardContent className="py-8 rounded-t-lg rounded-b-lg bg-transparent">
                  <Stack gap="lg">
                    <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                      <svg
                        width="56"
                        height="56"
                        viewBox="0 0 42 42"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-success"
                      >
                        <circle cx="6" cy="30" r="3" fill="currentColor" opacity="0.8" />
                        <path
                          d="M36 6V16H30V10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                        <path
                          d="M9 28C12 24 15 22 18 22C21 22 24 26 27 18C30 12 32 14 35 10"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          opacity="0.7"
                        />
                        <circle cx="18" cy="22" r="2" fill="currentColor" opacity="0.5" />
                        <circle cx="27" cy="18" r="2" fill="currentColor" opacity="0.6" />
                      </svg>
                    </div>
                    <Heading level="h5">All Distances</Heading>
                    <Paragraph color="secondary" size="sm">
                      From fun 5K runs to challenging marathons, find events that
                      match your fitness level and goals
                    </Paragraph>
                  </Stack>
                </CardContent>
              </Card>

              {/* Live Updates Card */}
              <Card
                interactive
                className="md:col-span-3"
                style={{ background: "linear-gradient(to bottom right, rgba(181, 173, 130, 0.3), rgb(250, 248, 246)) !important" }}
              >
                <CardContent className="py-8 rounded-t-lg rounded-b-lg bg-transparent">
                  <Stack gap="lg">
                    <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                      <svg
                        width="56"
                        height="56"
                        viewBox="0 0 42 42"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-error"
                      >
                        <circle cx="21" cy="21" r="6" fill="currentColor" opacity="0.8" />
                        <path
                          d="M15 24C15 24 13 28 21 30C29 28 27 24 27 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          fill="none"
                        />
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
                        <circle cx="18" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
                        <circle cx="33" cy="16" r="1.5" fill="currentColor" opacity="0.5" />
                      </svg>
                    </div>
                    <Heading level="h5">Live Updates</Heading>
                    <Paragraph color="secondary" size="sm">
                      Real-time event information with up-to-date registration links
                      and event details
                    </Paragraph>
                  </Stack>
                </CardContent>
              </Card>
            </div>
          </Stack>
        </Container>
      </Section>

      {/* Experience Section */}
      <Section py="2xl" className="bg-white">
        <Container>
          <Stack gap="xl" className="max-w-3xl mx-auto text-center">
            <Heading level="h2" fluid>
              Experience the Mountains
            </Heading>
            <Stack gap="md">
              <Paragraph size="lg" color="secondary" fluid>
                North Georgia offers some of the most scenic and challenging running
                routes in the Southeast. From the rolling hills of the Piedmont to
                the rugged trails of the Blue Ridge Mountains, there's a path for
                every runner. Whether you're training for your first 5K or an
                ultra-marathon, our community is here to support your journey.
              </Paragraph>
              <Paragraph size="lg" color="secondary" fluid>
                Join us in exploring the hidden gems, historic towns, and
                breathtaking vistas that make running in North Georgia truly unique.
              </Paragraph>
            </Stack>
          </Stack>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section py="2xl" className="bg-neutral-100">
        <Container>
          <Stack gap="lg" className="text-center max-w-2xl mx-auto">
            <Heading level="h2" fluid>
              Have a Running Event?
            </Heading>
            <Paragraph size="lg" color="secondary" fluid>
              Help runners discover your event! Submit your race, marathon, or
              running event to our growing calendar.
            </Paragraph>
            <div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setSubmitFormOpen(true)}
              >
                Submit Your Event
              </Button>
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
