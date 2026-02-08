"use client";

import EventForm from "../_components/EventForm";
import Navigation from "../_components/Navigation";
import Footer from "../_components/Footer";
import {
  Container,
  Section,
  Stack,
  Heading,
  Paragraph,
  Card,
  CardContent,
  Text,
} from "~/app/_components/primitives";

export default function PromotersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navigation />

      <div className="flex-grow">
        <Section py="2xl">
          <Container>
            <Stack gap="xl">
              {/* Hero Section */}
              <Stack gap="lg" className="text-center">
                <Heading level="h1" fluid>
                  Promote Your Event
                </Heading>
                <Paragraph
                  size="lg"
                  color="secondary"
                  fluid
                  className="max-w-2xl mx-auto"
                >
                  Reach thousands of runners in North Georgia by listing your race
                  with us.
                </Paragraph>
              </Stack>

              {/* Event Form Card */}
              <Card>
                <CardContent>
                  <Stack gap="lg">
                    <Stack gap="md">
                      <Heading level="h3" color="accent">
                        Submit Your Race Details
                      </Heading>
                      <Paragraph color="secondary">
                        Fill out the form below to submit your event for review. Once
                        approved, your race will be listed on our events calendar and
                        searchable by our community.
                      </Paragraph>
                    </Stack>
                    <EventForm />
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Container>
        </Section>

        {/* Benefits Section */}
        <Section py="2xl" className="bg-white">
          <Container>
            <Stack gap="xl">
              <Heading level="h2" fluid className="text-center">
                Why List With Us?
              </Heading>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Targeted Audience */}
                <Card interactive className="bg-gradient-to-br from-neutral-100 to-neutral-50">
                  <CardContent>
                    <Stack gap="md">
                      <Heading level="h5">Targeted Audience</Heading>
                      <Paragraph color="secondary" size="sm">
                        Connect directly with passionate runners looking for events in
                        the North Georgia mountains and surrounding areas.
                      </Paragraph>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Free Listing */}
                <Card interactive className="bg-gradient-to-br from-neutral-100 to-neutral-50">
                  <CardContent>
                    <Stack gap="md">
                      <Heading level="h5">Free Listing</Heading>
                      <Paragraph color="secondary" size="sm">
                        Basic event listings are completely free. We believe in
                        supporting the local running community.
                      </Paragraph>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Easy Management */}
                <Card interactive className="bg-gradient-to-br from-neutral-100 to-neutral-50">
                  <CardContent>
                    <Stack gap="md">
                      <Heading level="h5">Easy Management</Heading>
                      <Paragraph color="secondary" size="sm">
                        Simple submission process. Our team verifies all events to
                        ensure quality and accuracy for our users.
                      </Paragraph>
                    </Stack>
                  </CardContent>
                </Card>
              </div>
            </Stack>
          </Container>
        </Section>
      </div>

      <Footer />
    </div>
  );
}
