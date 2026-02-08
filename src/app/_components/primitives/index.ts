/**
 * Design System Primitives
 *
 * Reusable, composable UI components that form the foundation of the design system.
 * All primitives:
 * - Work in isolation
 * - Accept standard HTML attributes
 * - Use design tokens from src/styles/design-tokens.css
 * - Support forwardRef for advanced use cases
 * - Have consistent styling and behavior
 *
 * Usage:
 * import { Button, Card, Heading, Container } from "~/app/_components/primitives"
 */

// Typography
export { Heading, Paragraph, Text, Label } from "./Text";

// Form Inputs
export { Input, Textarea, Select } from "./Input";

// Buttons & Controls
export { Button } from "./Button";

// Data Display
export { Card, CardHeader, CardContent, CardFooter } from "./Card";
export { Badge, StatusBadge } from "./Badge";

// Layout
export { Container, Flex, Stack, Section } from "./Layout";
