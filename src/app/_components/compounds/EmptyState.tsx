/**
 * EmptyState - Compound Component
 * Display when no data/results are available
 */

import React from "react";
import { Stack, Heading, Paragraph, Button } from "~/app/_components/primitives";

interface EmptyStateProps {
  icon?: React.ReactNode | string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { icon, title, description, actionText, onAction, className = "" },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`py-12 px-4 text-center ${className}`}
      >
        <Stack gap="md" className="max-w-md mx-auto">
          {icon && (
            <div className="text-5xl">
              {typeof icon === "string" ? icon : icon}
            </div>
          )}
          <Heading level="h3">{title}</Heading>
          <Paragraph color="secondary">{description}</Paragraph>
          {actionText && onAction && (
            <div>
              <Button variant="primary" onClick={onAction}>
                {actionText}
              </Button>
            </div>
          )}
        </Stack>
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";
