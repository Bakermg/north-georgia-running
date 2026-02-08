"use client";

import { useState } from "react";
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
  Badge,
} from "~/app/_components/primitives";

interface ImportResult {
  imported: number;
  duplicates: number;
}

interface AllImportResult {
  runsignup: ImportResult;
  atc: ImportResult;
  active: ImportResult;
  total: ImportResult;
}

export default function EventImportsPage() {
  const [importResult, setImportResult] = useState<AllImportResult | null>(null);
  const [singleResult, setSingleResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: stats, refetch: refetchStats } = api.events.getStats.useQuery();

  const importAllMutation = api.events.importAllEvents.useMutation({
    onSuccess: (data) => {
      setImportResult(data);
      setSingleResult(null);
      setError(null);
      void refetchStats();
    },
    onError: (err) => {
      setError(err.message);
      setImportResult(null);
    },
  });

  const importRunSignUpMutation = api.events.importEvents.useMutation({
    onSuccess: (data) => {
      setSingleResult(data);
      setImportResult(null);
      setError(null);
      void refetchStats();
    },
    onError: (err) => {
      setError(err.message);
      setSingleResult(null);
    },
  });

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
              Import running events from multiple data sources to populate your database.
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

          {/* Import All Button */}
          <Card>
            <CardContent>
              <Flex justify="between" align="center" className="flex-wrap gap-4">
                <Stack gap="sm">
                  <Heading level="h5">Import from All Sources</Heading>
                  <Paragraph size="sm" color="secondary">
                    Fetch and import events from RunSignUp, Atlanta Track Club, and
                    Active.com in one click.
                  </Paragraph>
                </Stack>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => importAllMutation.mutate()}
                  disabled={importAllMutation.isPending}
                >
                  {importAllMutation.isPending ? "⟳ Importing..." : "⬇ Import All"}
                </Button>
              </Flex>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <div className="bg-error/10 border-l-4 border-error p-4 rounded">
              <Text color="error" weight="semibold">
                {error}
              </Text>
            </div>
          )}

          {/* Import Results */}
          {importResult && (
            <div className="bg-success/10 border-l-4 border-success p-4 rounded">
              <Stack gap="md">
                <Text color="success" weight="semibold">
                  ✓ Import Complete!
                </Text>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>RunSignUp:</strong> {importResult.runsignup.imported} imported,{" "}
                    {importResult.runsignup.duplicates} duplicates
                  </div>
                  <div>
                    <strong>Atlanta Track Club:</strong> {importResult.atc.imported} imported,{" "}
                    {importResult.atc.duplicates} duplicates
                  </div>
                  <div>
                    <strong>Active.com:</strong> {importResult.active.imported} imported,{" "}
                    {importResult.active.duplicates} duplicates
                  </div>
                  <div className="border-t border-success/20 pt-2 mt-2">
                    <strong>Total:</strong> {importResult.total.imported} new events,{" "}
                    {importResult.total.duplicates} already existed
                  </div>
                </div>
              </Stack>
            </div>
          )}

          {singleResult && (
            <div className="bg-success/10 border-l-4 border-success p-4 rounded">
              <Text color="success" weight="semibold">
                ✓ Successfully imported {singleResult.imported} new events.{" "}
                {singleResult.duplicates} already existed.
              </Text>
            </div>
          )}

          {/* Data Sources */}
          <Stack gap="lg">
            <Heading level="h4">Data Sources</Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* RunSignUp */}
              <Card>
                <CardContent>
                  <Stack gap="lg">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => importRunSignUpMutation.mutate()}
                      disabled={importRunSignUpMutation.isPending}
                    >
                      {importRunSignUpMutation.isPending ? "⟳ Importing" : "⟳ Import"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Atlanta Track Club */}
              <Card>
                <CardContent>
                  <Stack gap="lg">
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
                    <Button variant="outline" size="sm" disabled>
                      Manual Import
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Active.com */}
              <Card>
                <CardContent>
                  <Stack gap="lg">
                    <Stack gap="md">
                      <Heading level="h5">📅 Active.com</Heading>
                      <Paragraph size="sm" color="secondary">
                        Additional events from Active.com API. Requires API key configuration.
                      </Paragraph>
                      {stats?.bySource["active_com"] && (
                        <Badge variant="accent">
                          {stats.bySource["active_com"]} events
                        </Badge>
                      )}
                    </Stack>
                    <Text size="xs" color="muted">
                      ℹ️ Requires ACTIVE_API_KEY
                    </Text>
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
