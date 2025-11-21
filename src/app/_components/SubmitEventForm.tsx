"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EventForm from "./EventForm";
import { useState } from "react";

interface SubmitEventFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SubmitEventForm({
  open,
  onClose,
  onSuccess,
}: SubmitEventFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
    if (onSuccess) {
      onSuccess();
    }
    // Close is handled by EventForm's internal timer calling onSuccess, 
    // but we also want to close the dialog eventually if the user doesn't click close
    setTimeout(() => {
      onClose();
      // Reset success state after closing for next time
      setTimeout(() => setIsSuccess(false), 500);
    }, 3000);
  };

  const handleClose = () => {
    onClose();
    setIsSuccess(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Submit Your Running Race
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <EventForm onSuccess={handleSuccess} onCancel={handleClose} />
      </DialogContent>
      
      {isSuccess && (
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
