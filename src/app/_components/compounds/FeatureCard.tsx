/**
 * FeatureCard - Compound Component
 * Display feature highlights with icon, value, title, and description
 * Used for showcasing key metrics or features in mosaic layouts
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, Stack, Heading, Text, Paragraph } from "~/app/_components/primitives";

interface FeatureCardProps {
  gridClass?: string;
  gradientColor?: "accent" | "primary" | "secondary" | "tertiary" | "random";
  label?: string;
  value?: string | number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const gradientMap = {
  accent: "linear-gradient(to bottom right, rgba(245, 173, 114, 0.3), rgb(250, 248, 246))",
  primary: "linear-gradient(to bottom right, rgba(217, 119, 87, 0.3), rgb(250, 248, 246))",
  secondary: "linear-gradient(to bottom right, rgba(155, 149, 144, 0.3), rgb(250, 248, 246))",
  tertiary: "linear-gradient(to bottom right, rgba(181, 173, 130, 0.3), rgb(250, 248, 246))",
};

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  (
    {
      gridClass = "",
      gradientColor = "random",
      label,
      value,
      title,
      description,
      icon,
      children,
      className = "",
    },
    ref
  ) => {
    const colorOptions: Array<"accent" | "primary" | "secondary" | "tertiary"> = [
      "accent",
      "primary",
      "secondary",
      "tertiary",
    ];

    // Use state for random color to avoid hydration mismatch
    const [selectedColor, setSelectedColor] = useState<"accent" | "primary" | "secondary" | "tertiary">(
      "accent"
    );

    // Set random color after hydration
    useEffect(() => {
      if (gradientColor === "random" || !gradientColor) {
        const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)]!;
        setSelectedColor(randomColor);
      } else {
        setSelectedColor(gradientColor as "accent" | "primary" | "secondary" | "tertiary");
      }
    }, [gradientColor]);

    const isLargeValue = value !== undefined && value !== null;
    const hasIcon = icon !== undefined;

    return (
      <Card
        ref={ref}
        interactive
        className={gridClass}
        style={{
          background: gradientMap[selectedColor],
        }}
      >
        <CardContent className="py-8 md:py-12 rounded-t-lg rounded-b-lg bg-transparent">
          <Stack gap={isLargeValue ? "md" : "lg"} className={className}>
            {/* Icon */}
            {hasIcon && (
              <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                {icon}
              </div>
            )}

            {/* Label */}
            {label && (
              <Text size="xs" color="muted" weight="semibold">
                {label.toUpperCase()}
              </Text>
            )}

            {/* Large Value */}
            {isLargeValue && (
              <Heading level="h2" size="5xl" color="accent">
                {value}
              </Heading>
            )}

            {/* Title */}
            <Heading level={isLargeValue ? "h3" : "h5"}>{title}</Heading>

            {/* Description */}
            <Paragraph color="secondary" size={hasIcon ? "sm" : "base"}>
              {description}
            </Paragraph>

            {/* Custom Children */}
            {children}
          </Stack>
        </CardContent>
      </Card>
    );
  }
);

FeatureCard.displayName = "FeatureCard";
