import React from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type TextSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";
type TextColor =
  | "primary"
  | "secondary"
  | "muted"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info";

const colorMap: Record<TextColor, string> = {
  primary: "text-neutral-900",
  secondary: "text-neutral-600",
  muted: "text-neutral-500",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  info: "text-info",
};

const sizeMap: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
};

const fluidSizeMap: Record<TextSize, string> = {
  xs: "text-fluid-xs",
  sm: "text-fluid-sm",
  base: "text-fluid-base",
  lg: "text-fluid-lg",
  xl: "text-fluid-xl",
  "2xl": "text-fluid-2xl",
  "3xl": "text-fluid-3xl",
  "4xl": "text-fluid-4xl",
  "5xl": "text-fluid-5xl",
};

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  size?: TextSize;
  color?: TextColor;
  fluid?: boolean;
  children: React.ReactNode;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level = "h2",
      size,
      color = "primary",
      fluid = true,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    // Infer size from level if not provided
    const computedSize: TextSize = size || {
      h1: "5xl",
      h2: "4xl",
      h3: "3xl",
      h4: "2xl",
      h5: "xl",
      h6: "lg",
    }[level as HeadingLevel] as TextSize;

    const sizeClass = fluid ? fluidSizeMap[computedSize] : sizeMap[computedSize];

    const Component = level as React.ElementType;

    return (
      <Component
        ref={ref}
        className={`
          font-heading font-bold
          ${sizeClass}
          ${colorMap[color]}
          ${className}
        `}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: TextSize;
  color?: TextColor;
  fluid?: boolean;
  children: React.ReactNode;
}

export const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  (
    {
      size = "base",
      color = "secondary",
      fluid = true,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const sizeClass = fluid ? fluidSizeMap[size] : sizeMap[size];

    return (
      <p
        ref={ref}
        className={`
          font-body leading-relaxed
          ${sizeClass}
          ${colorMap[color]}
          ${className}
        `}
        {...props}
      >
        {children}
      </p>
    );
  }
);

Paragraph.displayName = "Paragraph";

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: TextSize;
  color?: TextColor;
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  children: React.ReactNode;
}

const weightMap: Record<string, string> = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      size = "base",
      color = "primary",
      weight = "normal",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={`
          ${sizeMap[size]}
          ${colorMap[color]}
          ${weightMap[weight]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Text.displayName = "Text";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { children: React.ReactNode }
>(({ className = "", children, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-semibold text-neutral-700 ${className}`}
    {...props}
  >
    {children}
  </label>
));

Label.displayName = "Label";
