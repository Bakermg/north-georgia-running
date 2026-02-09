"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "~/trpc/react";
import type { ParsedRaceDetails } from "~/server/services/raceSearchService";

interface AddRaceDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: ParsedRaceDetails;
}

export default function AddRaceDialog({
  open,
  onClose,
  initialData,
}: AddRaceDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "08:00",
    location: "",
    distance: "",
    websiteUrl: "",
    organizerName: "",
    organizerEmail: "",
    organizerPhone: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const submitEventMutation = api.events.submitEvent.useMutation();
  const checkDuplicateMutation = api.raceFinder.checkDuplicate.useMutation();

  // Pre-fill form when initialData changes or dialog opens
  useEffect(() => {
    if (open && initialData) {
      let dateStr = "";
      if (initialData.date) {
        try {
          // Handle both Date objects and date strings
          const dateObj = initialData.date instanceof Date
            ? initialData.date
            : new Date(initialData.date);
          if (!isNaN(dateObj.getTime())) {
            dateStr = dateObj.toISOString().split("T")[0] ?? "";
          }
        } catch {
          dateStr = "";
        }
      }

      setFormData({
        name: initialData.name || "",
        date: dateStr,
        time: "08:00",
        location: initialData.location || "",
        distance: initialData.distance || "",
        websiteUrl: initialData.websiteUrl || "",
        organizerName: "",
        organizerEmail: "",
        organizerPhone: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setDuplicateWarning(null);

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.date ||
        !formData.time ||
        !formData.location ||
        !formData.distance ||
        !formData.websiteUrl ||
        !formData.organizerName ||
        !formData.organizerEmail
      ) {
        setError("Please fill in all required fields");
        return;
      }

      // Parse date and time
      const eventDate = new Date(formData.date);
      const [hours = "0", minutes = "0"] = formData.time.split(":");
      eventDate.setHours(parseInt(hours), parseInt(minutes));

      // Extract city from location (last part after comma)
      const locationParts = formData.location.split(",");
      const city =
        locationParts[locationParts.length - 1]?.trim() ?? formData.location;

      // Check for duplicates first
      const duplicateCheck = await checkDuplicateMutation.mutateAsync({
        name: formData.name,
        date: eventDate,
        city: city,
      });

      if (duplicateCheck.isDuplicate && duplicateCheck.existingEvent) {
        setDuplicateWarning(
          `A similar race "${duplicateCheck.existingEvent.name}" already exists in our database for ${duplicateCheck.existingEvent.city}.`
        );
        return;
      }

      await submitEventMutation.mutateAsync({
        name: formData.name,
        date: eventDate,
        location: formData.location,
        city: city,
        state: "GA",
        type: initialData?.type || "Running Event",
        distance: formData.distance,
        websiteUrl: formData.websiteUrl,
        organizerName: formData.organizerName,
        organizerEmail: formData.organizerEmail,
        organizerPhone: formData.organizerPhone || undefined,
      });

      setSuccessMessage(
        "Race submitted successfully! Our team will review and post it soon."
      );

      // Close dialog after delay
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
        setDuplicateWarning(null);
        setFormData({
          name: "",
          date: "",
          time: "08:00",
          location: "",
          distance: "",
          websiteUrl: "",
          organizerName: "",
          organizerEmail: "",
          organizerPhone: "",
        });
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit race");
    }
  };

  const handleClose = () => {
    if (!submitEventMutation.isPending && !checkDuplicateMutation.isPending) {
      setError("");
      setSuccessMessage("");
      setDuplicateWarning(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add Race to Database
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {duplicateWarning && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {duplicateWarning}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {initialData && !successMessage && !duplicateWarning && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Some details were auto-filled from the website. Please verify and
            complete the information.
          </Alert>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              {/* Race Name */}
              <TextField
                fullWidth
                label="Race Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Dahlonega Marathon"
                size="small"
              />

              {/* Race Website */}
              <TextField
                fullWidth
                label="Race Website *"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                type="url"
                size="small"
              />

              {/* Race Location */}
              <TextField
                fullWidth
                label="Race Location *"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Dahlonega, GA"
                size="small"
              />

              {/* Race Start Date and Time */}
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  label="Race Start Date *"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
                <TextField
                  label="Race Start Time *"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Box>

              {/* Race Distance(s) */}
              <TextField
                fullWidth
                label="Race Distance(s) *"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="e.g., 5K, 10K, Half Marathon"
                helperText="List all available distances"
                size="small"
              />

              {/* Contact Section Divider */}
              <Box sx={{ mt: 1, pt: 2, borderTop: "2px solid #e0e0e0" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Your Contact Information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  We may contact you to verify the race details.
                </Typography>
              </Box>

              {/* Contact Name */}
              <TextField
                fullWidth
                label="Your Name *"
                name="organizerName"
                value={formData.organizerName}
                onChange={handleChange}
                placeholder="Your full name"
                size="small"
              />

              {/* Contact Email */}
              <TextField
                fullWidth
                label="Your Email *"
                name="organizerEmail"
                value={formData.organizerEmail}
                onChange={handleChange}
                placeholder="your@email.com"
                type="email"
                size="small"
              />

              {/* Contact Phone */}
              <TextField
                fullWidth
                label="Your Phone (optional)"
                name="organizerPhone"
                value={formData.organizerPhone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                size="small"
              />
            </Box>
          </form>
        )}
      </DialogContent>

      {!successMessage && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={submitEventMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitEventMutation.isPending}
            sx={{
              backgroundColor: "#4a7c59",
              "&:hover": {
                backgroundColor: "#3d6548",
              },
            }}
          >
            {submitEventMutation.isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                Submitting...
              </>
            ) : (
              "Submit Race"
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
