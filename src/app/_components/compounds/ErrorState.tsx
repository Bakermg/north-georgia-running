/**
 * ErrorState - Compound Component
 * Display error message with optional retry action
 */

import React from "react";
import { Stack, Heading, Paragraph, Button } from "~/app/_components/primitives";

interface ErrorStateProps {
  title?: string;
  message: string;
  retryText?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      title = "Something went wrong",
      message,
      retryText,
      onRetry,
      className = "",
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`bg-error/10 border-l-4 border-error p-6 rounded ${className}`}
      >
        <Stack gap="md">
          <Stack gap="sm">
            <Heading level="h5" color="error">
              {title}
            </Heading>
            <Paragraph color="error" size="sm">
              {message}
            </Paragraph>
          </Stack>
          {retryText && onRetry && (
            <Button
              variant="error"
              size="sm"
              onClick={onRetry}
              className="w-fit"
            >
              {retryText}
            </Button>
          )}
        </Stack>
      </div>
    );
  }
);

ErrorState.displayName = "ErrorState";
