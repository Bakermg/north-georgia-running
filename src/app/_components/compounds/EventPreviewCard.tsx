/**
 * EventPreviewCard - Compound Component
 *
 * This demonstrates how to compose primitive components into a complete,
 * reusable compound component that works in isolation anywhere in the app.
 *
 * Built from: Card, Badge, Heading, Text, Button, Flex, Stack primitives
 */

import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Heading,
  Text,
  Button,
  Badge,
  Flex,
  Stack,
} from "~/app/_components/primitives";

interface EventPreviewCardProps {
  title: string;
  date: string;
  location: string;
  distance: string;
  description: string;
  status?: "upcoming" | "ongoing" | "completed";
  imageUrl?: string;
  registeredCount?: number;
  onViewDetails?: () => void;
}

export const EventPreviewCard = React.forwardRef<
  HTMLDivElement,
  EventPreviewCardProps
>(
  (
    {
      title,
      date,
      location,
      distance,
      description,
      status = "upcoming",
      imageUrl,
      registeredCount,
      onViewDetails,
    },
    ref
  ) => {
    const statusColorMap = {
      upcoming: "accent" as const,
      ongoing: "success" as const,
      completed: "secondary" as const,
    };

    return (
      <Card ref={ref} interactive className="overflow-hidden">
        {/* Image Container */}
        {imageUrl && (
          <div className="h-48 w-full overflow-hidden bg-neutral-200">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-slow"
            />
          </div>
        )}

        {/* Header with Badge */}
        <CardHeader>
          <Flex justify="between" align="center" gap="md">
            <Heading level="h4" size="lg" fluid={false}>
              {title}
            </Heading>
            <Badge variant={statusColorMap[status]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </Flex>
        </CardHeader>

        {/* Content */}
        <CardContent>
          <Stack gap="md">
            {/* Meta Information */}
            <Stack gap="sm">
              <Flex gap="md">
                <span className="text-lg">📅</span>
                <Text size="sm" color="secondary">
                  {date}
                </Text>
              </Flex>
              <Flex gap="md">
                <span className="text-lg">📍</span>
                <Text size="sm" color="secondary">
                  {location}
                </Text>
              </Flex>
              <Flex gap="md">
                <span className="text-lg">🏃</span>
                <Text size="sm" color="secondary">
                  {distance}
                </Text>
              </Flex>
            </Stack>

            {/* Description */}
            <Text size="base" color="secondary" className="line-clamp-3">
              {description}
            </Text>

            {/* Registration Info */}
            {registeredCount !== undefined && (
              <Text size="sm" color="muted" weight="medium">
                {registeredCount} runners registered
              </Text>
            )}
          </Stack>
        </CardContent>

        {/* Footer with Action */}
        <CardFooter>
          <Flex justify="end">
            <Button
              variant="primary"
              size="md"
              onClick={onViewDetails}
              className="w-full sm:w-auto"
            >
              View Details →
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    );
  }
);

EventPreviewCard.displayName = "EventPreviewCard";

/**
 * Usage Example:
 *
 * import { EventPreviewCard } from "~/app/_components/compounds/EventPreviewCard"
 *
 * <EventPreviewCard
 *   title="Blue Ridge Half Marathon"
 *   date="March 15, 2024"
 *   location="Dahlonega, GA"
 *   distance="13.1 mi"
 *   description="Join us for a scenic half marathon through the beautiful Blue Ridge Mountains..."
 *   status="upcoming"
 *   registeredCount={145}
 *   onViewDetails={() => router.push('/events/123')}
 * />
 */
