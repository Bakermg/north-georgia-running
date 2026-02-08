/**
 * UserCard - Compound Component
 * Display user profile information
 */

import React from "react";
import { Card, CardContent, Stack, Heading, Text, Badge } from "~/app/_components/primitives";

interface UserCardProps {
  name: string;
  email: string;
  role?: string;
  bio?: string;
  avatar?: string;
  stats?: Array<{
    label: string;
    value: string | number;
  }>;
  className?: string;
}

export const UserCard = React.forwardRef<HTMLDivElement, UserCardProps>(
  (
    { name, email, role, bio, avatar, stats, className = "" },
    ref
  ) => {
    return (
      <Card ref={ref} className={className}>
        <CardContent>
          <Stack gap="lg" className="text-center">
            {/* Avatar */}
            {avatar && (
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary"
              />
            )}

            {/* Name and Email */}
            <Stack gap="sm">
              <Heading level="h5">{name}</Heading>
              <Text size="sm" color="secondary">
                {email}
              </Text>
              {role && (
                <Badge variant="primary" className="justify-center">
                  {role}
                </Badge>
              )}
            </Stack>

            {/* Bio */}
            {bio && (
              <Text size="sm" color="secondary">
                {bio}
              </Text>
            )}

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
                {stats.map((stat, idx) => (
                  <Stack key={idx} gap="xs" className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {stat.value}
                    </div>
                    <Text size="xs" color="muted">
                      {stat.label}
                    </Text>
                  </Stack>
                ))}
              </div>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }
);

UserCard.displayName = "UserCard";
