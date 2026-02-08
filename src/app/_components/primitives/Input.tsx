import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { error = false, errorMessage, label, className = "", ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-md
            border-2 border-neutral-300
            font-body text-base
            placeholder:text-neutral-400
            transition-colors duration-base
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-offset-0 focus:ring-primary
            disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
            ${error ? "border-error focus:border-error focus:ring-error" : ""}
            ${className}
          `}
          {...props}
        />
        {error && errorMessage && (
          <p className="text-sm text-error mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { error = false, errorMessage, label, className = "", ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-md
            border-2 border-neutral-300
            font-body text-base
            placeholder:text-neutral-400
            transition-colors duration-base
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-offset-0 focus:ring-primary
            disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
            resize-vertical min-h-24
            ${error ? "border-error focus:border-error focus:ring-error" : ""}
            ${className}
          `}
          {...props}
        />
        {error && errorMessage && (
          <p className="text-sm text-error mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      error = false,
      errorMessage,
      label,
      placeholder,
      options,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-md
            border-2 border-neutral-300
            font-body text-base
            bg-white
            transition-colors duration-base
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-offset-0 focus:ring-primary
            disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
            ${error ? "border-error focus:border-error focus:ring-error" : ""}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && errorMessage && (
          <p className="text-sm text-error mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
