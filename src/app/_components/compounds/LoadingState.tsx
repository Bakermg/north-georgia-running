/**
 * LoadingState - Compound Component
 * Display loading indicator with message
 */

import React from "react";
import { Stack, Text } from "~/app/_components/primitives";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 border-2",
  md: "w-12 h-12 border-4",
  lg: "w-16 h-16 border-4",
};

export const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  (
    {
      message = "Loading...",
      size = "md",
      fullScreen = false,
      className = "",
    },
    ref
  ) => {
    const containerClass = fullScreen
      ? "fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50"
      : "flex items-center justify-center py-12";

    return (
      <div ref={ref} className={`${containerClass} ${className}`}>
        <Stack gap="md" className="text-center">
          <div className={`mx-auto ${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`} />
          {message && (
            <Text color="secondary" weight="medium">
              {message}
            </Text>
          )}
        </Stack>
      </div>
    );
  }
);

LoadingState.displayName = "LoadingState";
