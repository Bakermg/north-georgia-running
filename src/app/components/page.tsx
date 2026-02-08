/**
 * Component Kitchen Sink
 *
 * Comprehensive showcase of all primitives and compound components
 * Use this to test, document, and develop new components
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
  Label,
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
} from "~/app/_components/primitives";
import {
  EventPreviewCard,
  FilterBar,
  HeroSection,
  StatCard,
} from "~/app/_components/compounds";

export default function ComponentsPage() {
  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <HeroSection
        title="Component Kitchen Sink"
        subtitle="All Primitives & Compounds"
        description="Complete showcase of your design system components"
      />

      {/* Typography */}
      <Section>
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Typography</Heading>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Stack gap="sm">
                    <Text size="xs" color="muted" weight="semibold">
                      HEADING 1 (Fluid)
                    </Text>
                    <Heading level="h1">The quick brown fox</Heading>
                  </Stack>

                  <Stack gap="sm">
                    <Text size="xs" color="muted" weight="semibold">
                      HEADING 2 (Fluid)
                    </Text>
                    <Heading level="h2">The quick brown fox</Heading>
                  </Stack>

                  <Stack gap="sm">
                    <Text size="xs" color="muted" weight="semibold">
                      HEADING 3-6
                    </Text>
                    <Heading level="h3">Heading 3</Heading>
                    <Heading level="h4">Heading 4</Heading>
                    <Heading level="h5">Heading 5</Heading>
                    <Heading level="h6">Heading 6</Heading>
                  </Stack>

                  <Stack gap="sm">
                    <Text size="xs" color="muted" weight="semibold">
                      PARAGRAPH (Fluid)
                    </Text>
                    <Paragraph>
                      This is a body paragraph using fluid typography that scales
                      responsively from mobile to desktop without media queries.
                    </Paragraph>
                  </Stack>

                  <Stack gap="sm">
                    <Text size="xs" color="muted" weight="semibold">
                      TEXT COLORS
                    </Text>
                    <Text color="primary">Primary text</Text>
                    <Text color="secondary">Secondary text</Text>
                    <Text color="muted">Muted text</Text>
                    <Text color="accent">Accent text</Text>
                    <Text color="success">Success text</Text>
                    <Text color="warning">Warning text</Text>
                    <Text color="error">Error text</Text>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Section>

      {/* Buttons */}
      <Section className="bg-white">
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Buttons</Heading>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Stack gap="md">
                    <Text size="sm" weight="semibold" color="muted">
                      VARIANTS
                    </Text>
                    <Flex gap="md" className="flex-wrap">
                      <Button variant="primary">Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="accent">Accent</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="error">Error</Button>
                    </Flex>
                  </Stack>

                  <Stack gap="md">
                    <Text size="sm" weight="semibold" color="muted">
                      SIZES
                    </Text>
                    <Flex gap="md" className="flex-wrap">
                      <Button size="sm" variant="primary">
                        Small
                      </Button>
                      <Button size="md" variant="primary">
                        Medium
                      </Button>
                      <Button size="lg" variant="primary">
                        Large
                      </Button>
                    </Flex>
                  </Stack>

                  <Stack gap="md">
                    <Text size="sm" weight="semibold" color="muted">
                      STATES
                    </Text>
                    <Flex gap="md" className="flex-wrap">
                      <Button disabled>Disabled</Button>
                      <Button isLoading>Loading</Button>
                    </Flex>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Section>

      {/* Form Inputs */}
      <Section>
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Form Inputs</Heading>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Input label="Text Input" placeholder="Enter text..." />
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
                    label="Textarea"
                    placeholder="Enter a longer message..."
                  />
                  <Select
                    label="Select"
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

      {/* Cards */}
      <Section className="bg-white">
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Cards</Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Heading level="h4">Card with Header</Heading>
                </CardHeader>
                <CardContent>
                  <Paragraph color="secondary">
                    This card demonstrates the header, content, and footer
                    structure.
                  </Paragraph>
                </CardContent>
                <CardFooter>
                  <Flex justify="end">
                    <Button variant="outline" size="sm">
                      Action
                    </Button>
                  </Flex>
                </CardFooter>
              </Card>

              <Card interactive>
                <CardContent>
                  <Stack gap="md">
                    <Heading level="h5">Interactive Card</Heading>
                    <Paragraph color="secondary" size="sm">
                      Hover to see the interactive effect with lift and shadow
                      enhancement.
                    </Paragraph>
                  </Stack>
                </CardContent>
              </Card>
            </div>
          </Stack>
        </Container>
      </Section>

      {/* Badges */}
      <Section>
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Badges</Heading>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Stack gap="md">
                    <Text size="sm" weight="semibold" color="muted">
                      VARIANTS
                    </Text>
                    <Flex gap="md" className="flex-wrap">
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
                      STATUS BADGES
                    </Text>
                    <Flex gap="md" className="flex-wrap">
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

      {/* Compound Components */}
      <Section className="bg-white">
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Compound Components</Heading>

            {/* Stat Cards */}
            <Stack gap="md">
              <Heading level="h4">Stat Cards</Heading>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  icon="📅"
                  value={328}
                  label="Total Events"
                  color="primary"
                />
                <StatCard
                  icon="🏃"
                  value={1200}
                  label="Registered Runners"
                  color="accent"
                />
                <StatCard
                  icon="📍"
                  value={25}
                  label="Cities"
                  color="secondary"
                />
                <StatCard
                  icon="🎯"
                  value="42%"
                  label="Growth YoY"
                  color="success"
                />
              </div>
            </Stack>

            {/* Event Preview Card */}
            <Stack gap="md">
              <Heading level="h4">Event Preview Card</Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EventPreviewCard
                  title="Blue Ridge Half Marathon"
                  date="March 15, 2024"
                  location="Dahlonega, GA"
                  distance="13.1 mi"
                  description="Join us for a scenic half marathon through the beautiful Blue Ridge Mountains with stunning views."
                  status="upcoming"
                  registeredCount={145}
                />
                <EventPreviewCard
                  title="Peach City 5K"
                  date="April 20, 2024"
                  location="Fort Valley, GA"
                  distance="5 km"
                  description="A fast and fun 5K through historic downtown with community support."
                  status="completed"
                  registeredCount={89}
                />
              </div>
            </Stack>

            {/* Filter Bar */}
            <Stack gap="md">
              <Heading level="h4">Filter Bar</Heading>
              <FilterBar
                searchValue=""
                onSearchChange={() => {}}
                cityValue=""
                onCityChange={() => {}}
                typeValue=""
                onTypeChange={() => {}}
                distanceValue=""
                onDistanceChange={() => {}}
                dateFromValue=""
                onDateFromChange={() => {}}
                dateToValue=""
                onDateToChange={() => {}}
              />
            </Stack>
          </Stack>
        </Container>
      </Section>

      {/* Design Tokens Reference */}
      <Section>
        <Container>
          <Stack gap="xl">
            <Heading level="h2">Design Tokens</Heading>

            <Card>
              <CardContent>
                <Stack gap="lg">
                  <Stack gap="md">
                    <Heading level="h5">Color Palette</Heading>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <div className="h-12 bg-primary rounded" />
                        <Text size="xs" weight="semibold">
                          Primary
                        </Text>
                        <Text size="xs" color="muted">
                          #9a3319
                        </Text>
                      </div>
                      <div className="space-y-2">
                        <div className="h-12 bg-accent rounded" />
                        <Text size="xs" weight="semibold">
                          Accent
                        </Text>
                        <Text size="xs" color="muted">
                          #eb781b
                        </Text>
                      </div>
                      <div className="space-y-2">
                        <div className="h-12 bg-secondary rounded" />
                        <Text size="xs" weight="semibold">
                          Secondary
                        </Text>
                        <Text size="xs" color="muted">
                          #605a52
                        </Text>
                      </div>
                      <div className="space-y-2">
                        <div className="h-12 bg-success rounded" />
                        <Text size="xs" weight="semibold">
                          Success
                        </Text>
                        <Text size="xs" color="muted">
                          #5a8f5c
                        </Text>
                      </div>
                      <div className="space-y-2">
                        <div className="h-12 bg-error rounded" />
                        <Text size="xs" weight="semibold">
                          Error
                        </Text>
                        <Text size="xs" color="muted">
                          #c97a7e
                        </Text>
                      </div>
                    </div>
                  </Stack>

                  <Stack gap="md">
                    <Heading level="h5">Spacing Scale</Heading>
                    <Text size="sm" color="secondary">
                      8px base unit: 4px → 8px → 12px → 16px → 20px → 24px → 32px → 48px →
                      64px → 80px → 96px
                    </Text>
                  </Stack>

                  <Stack gap="md">
                    <Heading level="h5">Fluid Typography</Heading>
                    <Text size="sm" color="secondary">
                      All headings and body text use CSS clamp() for responsive scaling
                      without media queries.
                    </Text>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Section>
    </div>
  );
}
