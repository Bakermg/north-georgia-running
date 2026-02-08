import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  children: React.ReactNode;
}

const sizeMap: Record<string, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-7xl",
  full: "w-full",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "lg", className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeMap[size]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col";
  justify?: "start" | "center" | "between" | "around" | "end";
  align?: "start" | "center" | "end" | "stretch";
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

const justifyMap: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  end: "justify-end",
};

const alignMap: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const gapMap: Record<string, string> = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      direction = "row",
      justify = "start",
      align = "start",
      gap = "md",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          flex
          ${direction === "row" ? "flex-row" : "flex-col"}
          ${justifyMap[justify]}
          ${alignMap[align]}
          ${gapMap[gap]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = "Flex";

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  children: React.ReactNode;
}

const stackGapMap: Record<string, string> = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
};

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ gap = "md", className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col ${stackGapMap[gap]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  py?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const pyMap: Record<string, string> = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
  xl: "py-20",
  "2xl": "py-24",
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ py = "lg", className = "", children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={`${pyMap[py]} ${className}`}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";
