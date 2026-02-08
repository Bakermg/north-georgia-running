/**
 * EventGrid - Compound Component
 * Responsive grid layout for displaying multiple events
 */

import React from "react";

interface EventGridProps {
  children: React.ReactNode;
  columns?: {
    xs?: number;
    md?: number;
    lg?: number;
  };
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const gapClasses = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

const columnClasses = {
  1: "grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "lg:grid-cols-4",
};

export const EventGrid = React.forwardRef<HTMLDivElement, EventGridProps>(
  (
    {
      children,
      columns = { xs: 1, md: 2, lg: 3 },
      gap = "md",
      className = "",
    },
    ref
  ) => {
    const gridCols = `grid-cols-${columns.xs || 1} ${
      columns.md ? `md:grid-cols-${columns.md}` : ""
    } ${columns.lg ? `lg:grid-cols-${columns.lg}` : ""}`;

    return (
      <div
        ref={ref}
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gapClasses[gap]} ${className}`}
      >
        {children}
      </div>
    );
  }
);

EventGrid.displayName = "EventGrid";
