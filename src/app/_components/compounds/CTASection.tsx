/**
 * CTASection - Compound Component
 * Call-to-action section with headline and button
 */

import React from "react";
import {
  Stack,
  Heading,
  Paragraph,
  Button,
  Flex,
} from "~/app/_components/primitives";

interface CTASectionProps {
  title: string;
  description?: string;
  primaryText: string;
  primaryHref?: string;
  onPrimaryClick?: () => void;
  secondaryText?: string;
  secondaryHref?: string;
  onSecondaryClick?: () => void;
  backgroundClass?: string;
  className?: string;
}

export const CTASection = React.forwardRef<HTMLDivElement, CTASectionProps>(
  (
    {
      title,
      description,
      primaryText,
      primaryHref,
      onPrimaryClick,
      secondaryText,
      secondaryHref,
      onSecondaryClick,
      backgroundClass = "bg-gradient-to-r from-primary to-accent",
      className = "",
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${backgroundClass} py-12 md:py-16 rounded-lg ${className}`}
      >
        <div className="px-6 md:px-8">
          <Stack gap="lg" className="text-center max-w-2xl mx-auto">
            <Stack gap="md">
              <Heading level="h2" fluid className="text-white">
                {title}
              </Heading>
              {description && (
                <Paragraph size="lg" fluid className="text-white/90">
                  {description}
                </Paragraph>
              )}
            </Stack>

            <Flex
              gap="md"
              justify="center"
              align="center"
              className="flex-wrap"
            >
              {primaryHref ? (
                <a href={primaryHref}>
                  <Button variant="primary" size="lg" className="text-white">
                    {primaryText}
                  </Button>
                </a>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onPrimaryClick}
                  className="text-white"
                >
                  {primaryText}
                </Button>
              )}

              {secondaryText &&
                (secondaryHref ? (
                  <a href={secondaryHref}>
                    <Button variant="outline" size="lg">
                      {secondaryText}
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={onSecondaryClick}
                  >
                    {secondaryText}
                  </Button>
                ))}
            </Flex>
          </Stack>
        </div>
      </div>
    );
  }
);

CTASection.displayName = "CTASection";
