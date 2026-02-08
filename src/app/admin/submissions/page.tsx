"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Navigation from "~/app/_components/Navigation";
import Footer from "~/app/_components/Footer";
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
  StatusBadge,
} from "~/app/_components/primitives";

interface DeleteConfirm {
  id: number;
  name: string;
}

export default function AdminSubmissionsPage() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(null);

  const { data: pendingEvents, isLoading, refetch } =
    api.events.getPendingSubmissions.useQuery();

  const deleteMutation = api.events.deleteSubmission.useMutation({
    onSuccess: () => {
      void refetch();
      setDeleteConfirm(null);
    },
  });

  const approveMutation = api.events.approveSubmission.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const events = pendingEvents ?? [];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navigation />

      <Section py="2xl" className="flex-grow">
        <Container>
          <Stack gap="xl">
            {/* Header */}
            <Stack gap="md">
              <Heading level="h1" fluid>
                Pending Race Submissions
              </Heading>
              <Paragraph color="secondary">
                Review and manage race submissions from event organizers. Delete
                invalid races or approve them to make them visible to the public.
              </Paragraph>
            </Stack>

            {/* Empty State */}
            {events.length === 0 ? (
              <div className="bg-success/10 border-l-4 border-success p-4 rounded">
                <Text color="success" weight="semibold">
                  ✓ No pending submissions. All races are approved!
                </Text>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-100">
                          <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                            Race Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                            Distance
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                            Organizer
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-semibold text-neutral-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event, idx) => (
                          <tr
                            key={event.id}
                            className={`border-b border-neutral-200 hover:bg-neutral-50 transition-colors ${
                              idx % 2 === 0 ? "bg-white" : "bg-neutral-50"
                            }`}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                              {event.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-600">
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-600">
                              {event.location}
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-600">
                              {event.distance}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="space-y-1">
                                <div className="text-neutral-900 font-medium">
                                  {event.organizerName}
                                </div>
                                <div className="text-xs text-neutral-500">
                                  {event.organizerEmail}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Flex gap="md" justify="end">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() =>
                                    approveMutation.mutate({ id: event.id })
                                  }
                                  disabled={approveMutation.isPending}
                                >
                                  {approveMutation.isPending ? "..." : "✓ Approve"}
                                </Button>
                                <Button
                                  variant="error"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      id: event.id,
                                      name: event.name,
                                    })
                                  }
                                >
                                  Delete
                                </Button>
                              </Flex>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Messages */}
            {approveMutation.isSuccess && (
              <div className="bg-success/10 border-l-4 border-success p-4 rounded">
                <Text color="success" weight="semibold">
                  {approveMutation.data?.message}
                </Text>
              </div>
            )}

            {deleteMutation.isSuccess && (
              <div className="bg-info/10 border-l-4 border-info p-4 rounded">
                <Text color="info" weight="semibold">
                  {deleteMutation.data?.message}
                </Text>
              </div>
            )}

            {(approveMutation.isError || deleteMutation.isError) && (
              <div className="bg-error/10 border-l-4 border-error p-4 rounded">
                <Text color="error" weight="semibold">
                  {approveMutation.error?.message ??
                    deleteMutation.error?.message}
                </Text>
              </div>
            )}
          </Stack>
        </Container>
      </Section>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardContent>
              <Stack gap="lg">
                <Stack gap="md">
                  <Heading level="h4">Delete Race Submission?</Heading>
                  <Stack gap="md">
                    <Paragraph color="secondary">
                      Are you sure you want to delete{" "}
                      <strong>{deleteConfirm.name}</strong>?
                    </Paragraph>
                    <Text size="sm" color="muted">
                      This action cannot be undone. The race will be permanently
                      removed from the database.
                    </Text>
                  </Stack>
                </Stack>

                <Flex gap="md" justify="end">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() =>
                      deleteConfirm &&
                      deleteMutation.mutate({ id: deleteConfirm.id })
                    }
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </Flex>
              </Stack>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
