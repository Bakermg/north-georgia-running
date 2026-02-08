# North Georgia Running - Design System

## Overview

This is a comprehensive, token-based design system built with **Tailwind CSS**, **CSS Variables**, and **React primitives**. Every visual decision is centralized and reusable.

## Architecture

### 1. Design Tokens (`src/styles/design-tokens.css`)

The single source of truth for all design decisions:

- **Colors**: Primary, Accent, Secondary, Tertiary, Neutrals, Semantic (success, warning, error)
- **Typography**: Font families, sizes (static + fluid), weights, line heights, letter spacing
- **Spacing**: 8px-based modular scale (--space-1 through --space-24)
- **Shadows**: 6 levels from xs to xl
- **Border Radius**: Consistent scale from sm to 2xl
- **Transitions**: Fast, base, slow, slower
- **Z-Index**: Organized stacking context

### 2. Tailwind Configuration (`tailwind.config.ts`)

Configured to reference all design tokens as CSS variables, ensuring consistency across all utilities.

```bash
# Available utilities
text-primary, text-accent, text-secondary  # Colors
bg-primary, bg-accent                       # Backgrounds
px-4, py-6, gap-8                          # Spacing
text-lg, text-fluid-lg                     # Typography
rounded-lg, rounded-xl                      # Radius
shadow-md, shadow-lg                        # Shadows
```

### 3. Primitive Components (`src/app/_components/primitives/`)

Smallest reusable building blocks. All work in isolation.

#### Typography
- `<Heading />` - Semantic headings (h1-h6) with fluid sizing
- `<Paragraph />` - Body text with fluid scaling
- `<Text />` - Inline text with flexible styling
- `<Label />` - Form labels

#### Form Controls
- `<Input />` - Text input with optional error state
- `<Textarea />` - Multi-line input
- `<Select />` - Dropdown select

#### Layout
- `<Container />` - Constrained width wrapper
- `<Flex />` - Flexbox layout helper
- `<Stack />` - Vertical spacing utility
- `<Section />` - Full-width section container

#### UI Elements
- `<Button />` - 5 variants (primary, secondary, accent, outline, ghost)
- `<Card />` - Container with header, content, footer
- `<Badge />` - Status and category labels
- `<StatusBadge />` - Special badge with indicator dot

### 4. Compound Components (`src/app/_components/compounds/`)

Larger components composed from primitives.

Example: `EventPreviewCard.tsx`
- Combines Card, Badge, Button, Text, Flex, Stack
- Works independently
- Reusable across the app

## Usage

### Import Primitives

```tsx
import {
  Container,
  Heading,
  Button,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Flex,
} from "~/app/_components/primitives";
```

### Build a Component

```tsx
export function MyComponent() {
  return (
    <Container>
      <Stack gap="lg">
        <Heading level="h2" fluid>
          My Heading
        </Heading>

        <Card interactive>
          <CardContent>
            <Flex justify="between" align="center">
              <span>Content here</span>
              <Button variant="primary" size="sm">
                Action
              </Button>
            </Flex>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
```

## Fluid Typography

All headings and body text use `clamp()` for responsive scaling—no media queries needed.

```css
--font-size-fluid-xl: clamp(1.25rem, 3vw, 1.875rem);
```

- **Minimum**: Never shrinks below readable size
- **Preferred**: Scales with viewport width
- **Maximum**: Never grows too large

## Color Palette

```
Primary:      #71250E (dark) → #9a3319 → #d97757 (light)
Accent:       #cc5221 (dark) → #eb781b → #f5ad72 (light)
Secondary:    #365365 (dark) → #5b7a9e → #a8c5e0 (light)
Tertiary:     #6f6534 (dark) → #8a7e4e → #b5ad82 (light)
Neutrals:     50 → 100 → 200 → ... → 900
```

All colors are CSS variables:
```tsx
className="text-primary bg-accent-light border-neutral-200"
```

## Spacing Scale

Based on 8px base unit:

```
--space-1: 4px    --space-2: 8px    --space-3: 12px
--space-4: 16px   --space-5: 20px   --space-6: 24px
--space-8: 32px   --space-12: 48px  --space-16: 64px
```

Use consistently:
```tsx
<Stack gap="md" className="p-6">  {/* 24px */}
```

## Design System Showcase

Visit `/design-system` to see all components, colors, typography, and usage examples in action.

## Key Principles

### 1. No Hardcoded Values
❌ `className="bg-#d97757"`
✅ `className="bg-primary-light"`

### 2. Primitives First
Build new features by composing primitives, not creating one-offs.

### 3. Isolation
Every component works independently. Can be used anywhere.

### 4. Consistency
All pages automatically share colors, spacing, typography, and behavior.

### 5. Maintainability
Change design tokens once, updates everywhere.

## Component Checklist

When building a new component:

- [ ] Uses primitives from `~/app/_components/primitives`
- [ ] References only design tokens (no hardcoded colors/spacing)
- [ ] Works in isolation
- [ ] Accepts standard HTML attributes
- [ ] Has clear, semantic naming
- [ ] Includes forwardRef if needed

## Responsive Design

Primitives handle responsive behavior with Tailwind utilities:

```tsx
<Heading level="h2" fluid className="text-sm md:text-lg">
  Responsive Heading
</Heading>

<Flex direction={{ xs: "col", md: "row" }} gap="md">
  Responsive Layout
</Flex>
```

## Adding to the Design System

### New Primitive Component

1. Create file in `src/app/_components/primitives/`
2. Use design tokens only (CSS variables)
3. Export in `src/app/_components/primitives/index.ts`
4. Test in `/design-system` showcase

### New Compound Component

1. Create file in `src/app/_components/compounds/`
2. Compose from primitives
3. Document in comments
4. Add to `/design-system` page for visibility

### New Design Token

1. Add to `src/styles/design-tokens.css`
2. Update Tailwind config if needed
3. Update this guide

## Questions?

Refer to:
- **Design Tokens**: `src/styles/design-tokens.css`
- **Primitives**: `src/app/_components/primitives/`
- **Showcase**: `/design-system`
- **Example**: `src/app/_components/compounds/EventPreviewCard.tsx`
