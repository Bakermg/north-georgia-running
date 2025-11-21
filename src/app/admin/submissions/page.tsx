"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Navigation from "~/app/_components/Navigation";
import Footer from "~/app/_components/Footer";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Delete, CheckCircle } from "@mui/icons-material";

export default function AdminSubmissionsPage() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Fetch pending submissions
  const { data: pendingEvents, isLoading, refetch } =
    api.events.getPendingSubmissions.useQuery();

  // Delete mutation
  const deleteMutation = api.events.deleteSubmission.useMutation({
    onSuccess: () => {
      void refetch();
      setDeleteConfirm(null);
    },
  });

  // Approve mutation
  const approveMutation = api.events.approveSubmission.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const events = pendingEvents ?? [];

  return (
    <Box>
      <Navigation />

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Pending Race Submissions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review and manage race submissions from event organizers. Delete
              invalid races or approve them to make them visible to the public.
            </Typography>
          </Box>

          {events.length === 0 ? (
            <Alert severity="success">
              No pending submissions. All races are approved!
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f0eb" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Race Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Distance</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Organizer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Website Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id} hover>
                      <TableCell>{event.name}</TableCell>
                      <TableCell>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.distance}</TableCell>
                      <TableCell>
                        <Box sx={{ fontSize: "0.875rem" }}>
                          <div>{event.organizerName}</div>
                          <div style={{ opacity: 0.7 }}>
                            {event.organizerEmail}
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Verified"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<CheckCircle />}
                            onClick={() => approveMutation.mutate({ id: event.id })}
                            disabled={approveMutation.isPending}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() =>
                              setDeleteConfirm({
                                id: event.id,
                                name: event.name,
                              })
                            }
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Approval Success Alert */}
          {approveMutation.isSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {approveMutation.data?.message}
            </Alert>
          )}

          {/* Delete Success Alert */}
          {deleteMutation.isSuccess && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {deleteMutation.data?.message}
            </Alert>
          )}

          {/* Error Alert */}
          {(approveMutation.isError || deleteMutation.isError) && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {approveMutation.error?.message ?? deleteMutation.error?.message}
            </Alert>
          )}
        </Container>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Race Submission?</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. The race will be permanently removed from
            the database.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              deleteConfirm && deleteMutation.mutate({ id: deleteConfirm.id })
            }
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
}
