"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import type { Event } from "~/types";
import {
  Card,
  CardContent,
  CardFooter,
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Badge,
} from "~/app/_components/primitives";

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  onToggle: () => void;
}

// Helper function to format dates
function formatEventDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

export default function EventCard({ event, isRegistered, onToggle }: EventCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const utils = api.useUtils();

  const toggleMutation = api.userEvents.toggle.useMutation({
    onSuccess: () => {
      onToggle();
      void utils.userEvents.getMyEvents.invalidate();
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      return;
    }
    toggleMutation.mutate({ eventId: event.id });
  };

  return (
    <div
      onClick={() => router.push(`/events/${event.id}`)}
      className="cursor-pointer"
    >
      <Card interactive>
        {/* Image Section */}
        <div className="h-48 w-full bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden flex items-center justify-center relative group rounded-t-lg">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-5xl">🏃</span>
          )}

          {/* Save Button Overlay */}
          {session && (
            <button
              onClick={handleToggle}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-lg p-2 transition-all z-10"
              title={isRegistered ? "Remove from my events" : "Save event"}
            >
              {isRegistered ? "❤️" : "🤍"}
            </button>
          )}
        </div>

        {/* Content Section */}
        <CardContent>
          <Stack gap="md">
            {/* Type Badge */}
            <Badge variant="accent" className="w-fit">
              {event.type}
            </Badge>

            {/* Event Title */}
            <Heading level="h5" className="line-clamp-2 hover:text-primary transition-colors">
              {event.name}
            </Heading>

            {/* Date */}
            <Text size="sm" color="secondary" weight="medium">
              📅 {formatEventDate(event.date)}
            </Text>

            {/* Location and Distance */}
            <Stack gap="sm">
              <Flex gap="md" className="text-sm">
                <Text size="sm" color="secondary">
                  📍 {event.location}
                </Text>
              </Flex>
              <Flex gap="md" className="text-sm">
                <Text size="sm" color="secondary">
                  🏁 {event.distance}
                </Text>
              </Flex>
            </Stack>
          </Stack>
        </CardContent>

        {/* Action Buttons */}
        <CardFooter>
          <Flex gap="md" className="w-full flex-wrap">
            {event.registrationLink && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1"
              >
                <Button variant="primary" size="sm" className="w-full">
                  Register
                </Button>
              </a>
            )}
            {event.websiteUrl && (
              <a
                href={event.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={event.registrationLink ? "flex-1" : "flex-1"}
              >
                <Button variant="outline" size="sm" className="w-full">
                  Website
                </Button>
              </a>
            )}
          </Flex>
        </CardFooter>
      </Card>
    </div>
  );
}
