import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
    "transition-all duration-200 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-neutral-900 text-neutral-50 shadow-sm",
          "hover:bg-neutral-800 hover:shadow-md",
          "focus:ring-neutral-900",
          "active:bg-neutral-950 active:shadow-sm",
          "dark:bg-neutral-50 dark:text-neutral-900",
          "dark:hover:bg-neutral-200",
          "dark:focus:ring-neutral-50",
          "dark:active:bg-neutral-100",
        ],
        secondary: [
          "bg-neutral-100 text-neutral-900 shadow-sm",
          "hover:bg-neutral-200 hover:shadow-md",
          "focus:ring-neutral-900",
          "active:bg-neutral-300 active:shadow-sm",
          "dark:bg-neutral-800 dark:text-neutral-50",
          "dark:hover:bg-neutral-700",
          "dark:focus:ring-neutral-50",
          "dark:active:bg-neutral-600",
        ],
        outline: [
          "border border-neutral-300 bg-transparent text-neutral-900 shadow-sm",
          "hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-md",
          "focus:ring-neutral-900",
          "active:bg-neutral-100 active:shadow-sm",
          "dark:border-neutral-700 dark:text-neutral-50",
          "dark:hover:bg-neutral-800 dark:hover:border-neutral-600",
          "dark:focus:ring-neutral-50",
          "dark:active:bg-neutral-700",
        ],
        ghost: [
          "text-neutral-700 bg-transparent",
          "hover:bg-neutral-100 hover:text-neutral-900",
          "focus:ring-neutral-900",
          "active:bg-neutral-200",
          "dark:text-neutral-300",
          "dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
          "dark:focus:ring-neutral-50",
          "dark:active:bg-neutral-700",
        ],
        destructive: [
          "bg-red-600 text-white shadow-sm",
          "hover:bg-red-700 hover:shadow-md",
          "focus:ring-red-600",
          "active:bg-red-800 active:shadow-sm",
          "dark:bg-red-600",
          "dark:hover:bg-red-700",
          "dark:focus:ring-red-600",
          "dark:active:bg-red-800",
        ],
        link: [
          "text-neutral-900 underline-offset-4",
          "hover:underline",
          "focus:ring-neutral-900",
          "dark:text-neutral-50",
          "dark:focus:ring-neutral-50",
        ],
        success: [
          "bg-green-600 text-white shadow-sm",
          "hover:bg-green-700 hover:shadow-md",
          "focus:ring-green-600",
          "active:bg-green-800 active:shadow-sm",
        ],
      },
      size: {
        xs: "h-7 px-2 text-xs min-w-7",
        sm: "h-8 px-3 text-sm min-w-8",
        md: "h-10 px-4 text-sm min-w-10",
        lg: "h-12 px-6 text-base min-w-12",
        xl: "h-14 px-8 text-lg min-w-14",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {loading ? loadingText || "Loading..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button, buttonVariants };
export default Button;
