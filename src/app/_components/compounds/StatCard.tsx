/**
 * StatCard - Compound Component
 * Display statistics or key metrics
 */

import React from "react";
import { Card, CardContent, Stack, Heading, Text } from "~/app/_components/primitives";

interface StatCardProps {
  icon?: React.ReactNode;
  value: string | number;
  label: string;
  description?: string;
  color?: "primary" | "accent" | "secondary" | "success" | "warning" | "error";
}

const colorClasses = {
  primary: "text-primary",
  accent: "text-accent",
  secondary: "text-secondary",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    { icon, value, label, description, color = "primary" },
    ref
  ) => {
    return (
      <Card ref={ref} interactive>
        <CardContent>
          <Stack gap="md" className="text-center">
            {icon && (
              <div className={`text-4xl ${colorClasses[color]}`}>
                {icon}
              </div>
            )}
            <div>
              <div className={`text-4xl font-bold ${colorClasses[color]} mb-1`}>
                {value}
              </div>
              <Heading level="h5" className="mb-1">
                {label}
              </Heading>
              {description && (
                <Text size="sm" color="secondary">
                  {description}
                </Text>
              )}
            </div>
          </Stack>
        </CardContent>
      </Card>
    );
  }
);

StatCard.displayName = "StatCard";
