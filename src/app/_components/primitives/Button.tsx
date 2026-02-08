import React from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost" | "error";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-primary text-white
    hover:bg-primary-light
    active:bg-primary-dark
    disabled:bg-neutral-300 disabled:text-neutral-500
  `,
  secondary: `
    bg-secondary text-white
    hover:bg-secondary-light
    active:bg-secondary-dark
    disabled:bg-neutral-300 disabled:text-neutral-500
  `,
  accent: `
    bg-accent text-white
    hover:bg-accent-light
    active:bg-accent-dark
    disabled:bg-neutral-300 disabled:text-neutral-500
  `,
  outline: `
    border-2 border-primary text-primary bg-transparent
    hover:bg-primary hover:text-white
    active:bg-primary-dark
    disabled:border-neutral-300 disabled:text-neutral-300
  `,
  ghost: `
    text-primary bg-transparent
    hover:bg-primary hover:text-white
    disabled:text-neutral-300
  `,
  error: `
    bg-error text-white
    hover:bg-error hover:opacity-90
    active:opacity-75
    disabled:bg-neutral-300 disabled:text-neutral-500
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center
          rounded-md font-semibold
          transition-colors duration-base
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
          disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
