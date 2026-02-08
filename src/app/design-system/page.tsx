/**
 * Design System Showcase
 *
 * This page demonstrates all primitives, design tokens, and compound components.
 * Use this as a reference when building new components or pages.
 */

"use client";

import {
  Container,
  Section,
  Stack,
  Flex,
  Heading,
  Paragraph,
  Text,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Badge,
  StatusBadge,
  Input,
  Textarea,
  Select,
  Label,
} from "~/app/_components/primitives";
import { EventPreviewCard } from "~/app/_components/compounds/EventPreviewCard";

export default function DesignSystemPage() {
  return (
    <div className="bg-neutral-50">
      {/* Hero Section */}
      <Section py="2xl" className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <Container>
          <Stack gap="lg" className="text-center">
            <Heading level="h1" color="primary" fluid className="text-white">
              North Georgia Running
            </Heading>
            <Heading level="h2" color="primary" fluid className="text-white">
              Design System
            </Heading>
            <Paragraph color="primary" fluid className="text-white opacity-90 max-w-2xl mx-auto">
              A comprehensive guide to our design language, components, and patterns.
            </Paragraph>
          </Stack>
        </Container>
      </Section>

      {/* Typography Section */}
      <Section>
        <Container>
          <Stack gap="xl">
            <Stack gap="md">
              <Heading level="h2">Typography</Heading>
              <Paragraph color="secondary">
                All headings use fluid sizing that scales responsively from mobile to desktop.
              </Paragraph>
            </Stack>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Stack gap="sm">
                    <Text size="xs" color="muted" weight="semibold">
                      HEADING 1 (Fluid)
                    </Text>
                    <Heading level="h1">The quick brown fox jumps over the lazy dog</Heading>
                  </Stack>

                  <Stack gap="sm">
                    <Text size="xs" color="muted" weight="semibold">
                      HEADING 2 (Fluid)
                    </Text>
                    <Heading level="h2">The quick brown fox jumps over the lazy dog</Heading>
                  </Stack>

                  <Stack gap="sm">
                    <Text size="xs" color="muted" weight="semibold">
                      HEADING 3 (Fluid)
                    </Text>
                    <Heading level="h3">The quick brown fox jumps over the lazy dog</Heading>
                  </Stack>

                  <Stack gap="sm">
                    <Text size="xs" color="muted" weight="semibold">
                      PARAGRAPH (Body, Fluid)
                    </Text>
                    <Paragraph>
                      The quick brown fox jumps over the lazy dog. This is a sample paragraph using
                      the body typography style with fluid scaling for responsive design.
                    </Paragraph>
                  </Stack>

                  <Stack gap="sm">
                    <Text size="xs" color="muted" weight="semibold">
                      TEXT SIZES (Static)
                    </Text>
                    <Stack gap="sm">
                      {["xs", "sm", "base", "lg", "xl"].map((size) => (
                        <Text key={size} size={size as any}>
                          Text size: {size}
                        </Text>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Section>

      {/* Colors Section */}
      <Section className="bg-white">
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Color Palette</Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary */}
              <Card>
                <CardContent className="pt-8">
                  <Stack gap="md">
                    <div className="space-y-2">
                      <div className="h-16 bg-primary rounded-lg" />
                      <Text size="sm" weight="semibold">
                        Primary
                      </Text>
                      <Text size="xs" color="muted">
                        var(--color-primary)
                      </Text>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 bg-primary-light rounded-lg border border-neutral-200" />
                      <Text size="sm" weight="semibold">
                        Primary Light
                      </Text>
                      <Text size="xs" color="muted">
                        var(--color-primary-light)
                      </Text>
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              {/* Accent */}
              <Card>
                <CardContent className="pt-8">
                  <Stack gap="md">
                    <div className="space-y-2">
                      <div className="h-16 bg-accent rounded-lg" />
                      <Text size="sm" weight="semibold">
                        Accent
                      </Text>
                      <Text size="xs" color="muted">
                        var(--color-accent)
                      </Text>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 bg-accent-light rounded-lg border border-neutral-200" />
                      <Text size="sm" weight="semibold">
                        Accent Light
                      </Text>
                      <Text size="xs" color="muted">
                        var(--color-accent-light)
                      </Text>
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              {/* Secondary */}
              <Card>
                <CardContent className="pt-8">
                  <Stack gap="md">
                    <div className="space-y-2">
                      <div className="h-16 bg-secondary rounded-lg" />
                      <Text size="sm" weight="semibold">
                        Secondary
                      </Text>
                      <Text size="xs" color="muted">
                        var(--color-secondary)
                      </Text>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 bg-secondary-light rounded-lg border border-neutral-200" />
                      <Text size="sm" weight="semibold">
                        Secondary Light
                      </Text>
                      <Text size="xs" color="muted">
                        var(--color-secondary-light)
                      </Text>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
            </div>
          </Stack>
        </Container>
      </Section>

      {/* Buttons Section */}
      <Section>
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Buttons</Heading>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Stack gap="md">
                    <Text size="sm" weight="semibold" color="muted">
                      Primary Button Variants
                    </Text>
                    <Flex gap="md" align="center" className="flex-wrap">
                      <Button variant="primary" size="sm">
                        Small
                      </Button>
                      <Button variant="primary" size="md">
                        Medium
                      </Button>
                      <Button variant="primary" size="lg">
                        Large
                      </Button>
                      <Button variant="primary" disabled>
                        Disabled
                      </Button>
                    </Flex>
                  </Stack>

                  <Stack gap="md">
                    <Text size="sm" weight="semibold" color="muted">
                      Other Variants
                    </Text>
                    <Flex gap="md" align="center" className="flex-wrap">
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="accent">Accent</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                    </Flex>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Section>

      {/* Badges Section */}
      <Section className="bg-white">
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Badges</Heading>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Stack gap="md">
                    <Text size="sm" weight="semibold" color="muted">
                      Badge Variants
                    </Text>
                    <Flex gap="md" align="center" className="flex-wrap">
                      <Badge variant="primary">Primary</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="accent">Accent</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="error">Error</Badge>
                    </Flex>
                  </Stack>

                  <Stack gap="md">
                    <Text size="sm" weight="semibold" color="muted">
                      Status Badges
                    </Text>
                    <Flex gap="md" align="center" className="flex-wrap">
                      <StatusBadge status="active">Active</StatusBadge>
                      <StatusBadge status="inactive">Inactive</StatusBadge>
                      <StatusBadge status="pending">Pending</StatusBadge>
                      <StatusBadge status="completed">Completed</StatusBadge>
                    </Flex>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Section>

      {/* Form Elements Section */}
      <Section>
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Form Elements</Heading>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Input
                    label="Text Input"
                    placeholder="Enter some text..."
                  />
                  <Input
                    label="Email Input"
                    type="email"
                    placeholder="your@email.com"
                  />
                  <Input
                    label="Input with Error"
                    error={true}
                    errorMessage="This field is required"
                  />
                  <Textarea
                    label="Text Area"
                    placeholder="Enter a longer message..."
                  />
                  <Select
                    label="Select Option"
                    placeholder="Choose an option"
                    options={[
                      { value: "opt1", label: "Option 1" },
                      { value: "opt2", label: "Option 2" },
                      { value: "opt3", label: "Option 3" },
                    ]}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Section>

      {/* Compound Component Example */}
      <Section className="bg-white">
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Compound Component Example</Heading>
            <Paragraph color="secondary">
              Here&apos;s how primitives are composed into a complete, reusable component.
            </Paragraph>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EventPreviewCard
                title="Blue Ridge Half Marathon"
                date="March 15, 2024"
                location="Dahlonega, GA"
                distance="13.1 mi"
                description="Join us for a scenic half marathon through the beautiful Blue Ridge Mountains with stunning views and challenging terrain."
                status="upcoming"
                registeredCount={145}
              />
              <EventPreviewCard
                title="Peach City 5K"
                date="April 20, 2024"
                location="Fort Valley, GA"
                distance="5 km"
                description="A fast and fun 5K through historic downtown Fort Valley. Perfect for runners of all levels."
                status="completed"
                registeredCount={89}
              />
            </div>
          </Stack>
        </Container>
      </Section>

      {/* Design Tokens Reference */}
      <Section>
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Design Tokens Reference</Heading>
            <Paragraph color="secondary">
              All design decisions are centralized as CSS variables in{" "}
              <Text weight="semibold">src/styles/design-tokens.css</Text>
            </Paragraph>

            <Card>
              <CardContent>
                <Stack gap="md">
                  <Stack gap="sm">
                    <Text weight="semibold">Spacing Scale</Text>
                    <code className="text-xs bg-neutral-100 p-2 rounded">
                      var(--space-1) through var(--space-24)
                    </code>
                  </Stack>
                  <Stack gap="sm">
                    <Text weight="semibold">Font Sizes</Text>
                    <code className="text-xs bg-neutral-100 p-2 rounded">
                      var(--font-size-xs) through var(--font-size-5xl)
                    </code>
                  </Stack>
                  <Stack gap="sm">
                    <Text weight="semibold">Fluid Font Sizes</Text>
                    <code className="text-xs bg-neutral-100 p-2 rounded">
                      var(--font-size-fluid-xs) through var(--font-size-fluid-5xl)
                    </code>
                  </Stack>
                  <Stack gap="sm">
                    <Text weight="semibold">Colors</Text>
                    <code className="text-xs bg-neutral-100 p-2 rounded">
                      var(--color-primary), var(--color-accent), var(--color-secondary), etc.
                    </code>
                  </Stack>
                  <Stack gap="sm">
                    <Text weight="semibold">Shadows</Text>
                    <code className="text-xs bg-neutral-100 p-2 rounded">
                      var(--shadow-xs) through var(--shadow-xl)
                    </code>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Section>

      {/* Usage Guidelines */}
      <Section className="bg-white">
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Usage Guidelines</Heading>

            <Stack gap="lg">
              <Card>
                <CardHeader>
                  <Heading level="h4">1. Import Primitives</Heading>
                </CardHeader>
                <CardContent>
                  <code className="block bg-neutral-100 p-4 rounded text-sm overflow-auto">
                    import {"{"} Button, Card, Heading, Container {"}"} from
                    "~/app/_components/primitives"
                  </code>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heading level="h4">2. Compose Components</Heading>
                </CardHeader>
                <CardContent>
                  <Text color="secondary">
                    Use primitives together to build larger components. Keep them small and focused on a single responsibility.
                  </Text>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heading level="h4">3. Leverage Design Tokens</Heading>
                </CardHeader>
                <CardContent>
                  <Text color="secondary">
                    Use Tailwind classes that reference design tokens. Use only semantic color names and spacing scale values.
                  </Text>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heading level="h4">4. Never Hardcode Values</Heading>
                </CardHeader>
                <CardContent>
                  <Text color="secondary">
                    All colors, spacing, typography, and shadows should come from design tokens, not hardcoded values.
                  </Text>
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        </Container>
      </Section>
    </div>
  );
}
