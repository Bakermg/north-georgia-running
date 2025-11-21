"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";

interface EventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EventForm({ onSuccess, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    distance: "",
    websiteUrl: "",
    organizerName: "",
    organizerEmail: "",
    organizerPhone: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [websiteWarning, setWebsiteWarning] = useState<string | null>(null);

  const submitEventMutation = api.events.submitEvent.useMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setWebsiteWarning(null);

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
      const city = locationParts[locationParts.length - 1]?.trim() ?? formData.location;

      await submitEventMutation.mutateAsync({
        name: formData.name,
        date: eventDate,
        location: formData.location,
        city: city,
        state: "GA",
        type: "Running Event",
        distance: formData.distance,
        websiteUrl: formData.websiteUrl,
        organizerName: formData.organizerName,
        organizerEmail: formData.organizerEmail,
        organizerPhone: formData.organizerPhone || undefined,
      });

      setSuccessMessage(
        "Event submitted successfully! Our team will review and post it within 24 hours."
      );

      // Reset form
      setFormData({
        name: "",
        date: "",
        time: "",
        location: "",
        distance: "",
        websiteUrl: "",
        organizerName: "",
        organizerEmail: "",
        organizerPhone: "",
      });

      // Call onSuccess after a delay if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit event"
      );
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {websiteWarning && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {websiteWarning}
        </Alert>
      )}

      {!successMessage && (
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              helperText="Include http:// or https://"
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
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
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
            <Box sx={{ mt: 2, pt: 2, borderTop: "2px solid #e0e0e0" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Contact Information
              </Typography>
            </Box>

            {/* Contact Name */}
            <TextField
              fullWidth
              label="Contact Name *"
              name="organizerName"
              value={formData.organizerName}
              onChange={handleChange}
              placeholder="Your full name"
              size="small"
            />

            {/* Contact Email */}
            <TextField
              fullWidth
              label="Contact Email *"
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
              label="Contact Phone"
              name="organizerPhone"
              value={formData.organizerPhone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              size="small"
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
              {onCancel && (
                <Button onClick={onCancel} disabled={submitEventMutation.isPending}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={submitEventMutation.isPending}
              >
                {submitEventMutation.isPending ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Submitting...
                  </>
                ) : (
                  "Submit Race"
                )}
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </Box>
  );
}
