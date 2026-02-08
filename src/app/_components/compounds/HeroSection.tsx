/**
 * HeroSection - Compound Component
 * Reusable hero section for pages
 */

import React from "react";
import { Stack, Heading, Paragraph, Button } from "~/app/_components/primitives";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  backgroundImage?: string;
}

export const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      title,
      subtitle,
      description,
      ctaText,
      ctaHref,
      onCtaClick,
      backgroundImage,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="relative w-full py-16 md:py-24"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {backgroundImage && (
          <div className="absolute inset-0 bg-black/40" />
        )}
        <div className="relative z-10">
          <Stack gap="lg" className="text-center max-w-3xl mx-auto px-4">
            <Heading level="h1" fluid className={backgroundImage ? "text-white" : ""}>
              {title}
            </Heading>
            <Heading level="h2" fluid className={`${backgroundImage ? "text-white/90" : "text-accent"}`}>
              {subtitle}
            </Heading>
            {description && (
              <Paragraph
                size="lg"
                fluid
                className={backgroundImage ? "text-white/80" : "text-secondary"}
              >
                {description}
              </Paragraph>
            )}
            {(ctaText && (ctaHref || onCtaClick)) && (
              <div>
                {ctaHref ? (
                  <a href={ctaHref}>
                    <Button variant="primary" size="lg">
                      {ctaText}
                    </Button>
                  </a>
                ) : (
                  <Button variant="primary" size="lg" onClick={onCtaClick}>
                    {ctaText}
                  </Button>
                )}
              </div>
            )}
          </Stack>
        </div>
      </div>
    );
  }
);

HeroSection.displayName = "HeroSection";
