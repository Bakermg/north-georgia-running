"use client";

import { api } from "~/trpc/react";
import {
  Container,
  Section,
  Stack,
  Heading,
  Paragraph,
  Text,
  Card,
  CardContent,
  Badge,
} from "~/app/_components/primitives";


export default function EventImportsPage() {
  const { data: stats } = api.events.getStats.useQuery();

  return (
    <Section py="2xl">
      <Container>
        <Stack gap="xl">
          {/* Header */}
          <Stack gap="md">
            <Heading level="h1" fluid>
              Event Import Management
            </Heading>
            <Paragraph color="secondary">
              Events are automatically imported daily at 9 AM UTC from RunSignUp, Atlanta Track Club, Active.com, UltraRunning.com, and RunningInTheUSA.com.
            </Paragraph>
          </Stack>

          {/* Stats */}
          {stats && (
            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Heading level="h4">Current Database Statistics</Heading>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Events */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {stats.total}
                      </div>
                      <Text size="sm" color="secondary">
                        Total Events
                      </Text>
                    </div>

                    {/* Upcoming Events */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-success mb-2">
                        {stats.upcoming}
                      </div>
                      <Text size="sm" color="secondary">
                        Upcoming Events
                      </Text>
                    </div>

                    {/* By Source */}
                    <div>
                      <Text size="sm" weight="semibold" className="mb-2 block">
                        Events by Source
                      </Text>
                      <div className="space-y-1">
                        {Object.entries(stats.bySource).map(([source, count]) => (
                          <div key={source} className="text-sm text-secondary">
                            {source}: <strong>{count}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          )}



          {/* Data Sources */}
          <Stack gap="lg">
            <Heading level="h4">Data Sources</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* RunSignUp */}
              <Card>
                <CardContent>
                  <Stack gap="md">
                    <Heading level="h5">🏃 RunSignUp</Heading>
                    <Paragraph size="sm" color="secondary">
                      Primary source for Georgia running events. Uses the RunSignUp REST API.
                    </Paragraph>
                    {stats?.bySource["runsignup"] && (
                      <Badge variant="primary">
                        {stats.bySource["runsignup"]} events
                      </Badge>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Atlanta Track Club */}
              <Card>
                <CardContent>
                  <Stack gap="md">
                    <Heading level="h5">🏆 Atlanta Track Club</Heading>
                    <Paragraph size="sm" color="secondary">
                      Curated major events including Peachtree Road Race and Beltline series.
                    </Paragraph>
                    {stats?.bySource["atlanta_track_club"] && (
                      <Badge variant="secondary">
                        {stats.bySource["atlanta_track_club"]} events
                      </Badge>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Active.com */}
              <Card>
                <CardContent>
                  <Stack gap="md">
                    <Heading level="h5">📅 Active.com</Heading>
                    <Paragraph size="sm" color="secondary">
                      Additional events from Active.com API.
                    </Paragraph>
                    {stats?.bySource["active_com"] && (
                      <Badge variant="accent">
                        {stats.bySource["active_com"]} events
                      </Badge>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* UltraRunning.com */}
              <Card>
                <CardContent>
                  <Stack gap="md">
                    <Heading level="h5">🏔️ UltraRunning.com</Heading>
                    <Paragraph size="sm" color="secondary">
                      Ultra marathon and trail running events from UltraRunning.com.
                    </Paragraph>
                    {stats?.bySource["ultrarunning"] && (
                      <Badge variant="primary">
                        {stats.bySource["ultrarunning"]} events
                      </Badge>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* RunningInTheUSA.com */}
              <Card>
                <CardContent>
                  <Stack gap="md">
                    <Heading level="h5">🗺️ RunningInTheUSA</Heading>
                    <Paragraph size="sm" color="secondary">
                      Community running events from RunningInTheUSA.com.
                    </Paragraph>
                    {stats?.bySource["runningintheuasa"] && (
                      <Badge variant="secondary">
                        {stats.bySource["runningintheuasa"]} events
                      </Badge>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </div>
          </Stack>

          {/* Events by Type */}
          {stats && Object.keys(stats.byType).length > 0 && (
            <Card>
              <CardContent>
                <Stack gap="md">
                  <Heading level="h4">Events by Type</Heading>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stats.byType)
                      .sort((a, b) => (b[1] as number) - (a[1] as number))
                      .map(([type, count]) => (
                        <Badge key={type} variant="primary">
                          {type}: {count as number}
                        </Badge>
                      ))}
                  </div>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Container>
    </Section>
  );
}
