import React from "react";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error";
type BadgeSize = "sm" | "md";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  accent: "bg-accent text-white",
  success: "bg-success text-white",
  warning: "bg-warning text-white",
  error: "bg-error text-white",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "primary",
      size = "md",
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
          inline-flex items-center
          rounded-full font-semibold
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

type StatusBadgeStatus = "active" | "inactive" | "pending" | "completed";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusBadgeStatus;
  children: React.ReactNode;
}

const statusVariantMap: Record<StatusBadgeStatus, BadgeVariant> = {
  active: "success",
  inactive: "warning",
  pending: "secondary",
  completed: "primary",
};

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, children, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant={statusVariantMap[status]}
        size="sm"
        {...props}
      >
        <span className="mr-1 inline-block h-2 w-2 rounded-full bg-white opacity-60" />
        {children}
      </Badge>
    );
  }
);

StatusBadge.displayName = "StatusBadge";
