"use client";

import { useState, ReactNode, forwardRef } from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";

const navbarVariants = cva(
  [
    "w-full border-b transition-colors duration-200",
    "bg-white/95 backdrop-blur-sm text-neutral-900",
    "dark:bg-neutral-900/95 dark:text-neutral-100",
  ],
  {
    variants: {
      variant: {
        default: ["border-neutral-200", "dark:border-neutral-800"],
        floating: [
          "border-neutral-300 shadow-sm",
          "dark:border-neutral-700 dark:shadow-lg",
        ],
        solid: [
          "border-neutral-200 bg-white dark:bg-neutral-900",
          "dark:border-neutral-800",
        ],
        ghost: [
          "border-transparent bg-transparent backdrop-blur-none",
          "dark:bg-transparent",
        ],
      },
      size: {
        sm: "h-12",
        md: "h-16",
        lg: "h-20",
      },
      sticky: {
        true: "sticky top-0 z-40",
        false: "relative",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      sticky: false,
    },
  }
);

export interface NavbarItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps extends VariantProps<typeof navbarVariants> {
  brand?: ReactNode;
  items?: NavbarItem[];
  actions?: ReactNode;
  className?: string;
}

const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      brand,
      items = [],
      actions,
      variant = "default",
      size = "md",
      sticky = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
      <nav
        ref={ref}
        className={cn(navbarVariants({ variant, size, sticky }), className)}
        {...props}
      >
        <div className="mx-auto flex items-center justify-between px-4 h-full max-w-screen-xl">
          {brand && (
            <div className="flex items-center space-x-2 font-bold text-lg text-neutral-900 dark:text-neutral-100">
              {brand}
            </div>
          )}

          {items.length > 0 && (
            <div className="hidden md:flex items-center space-x-8">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 rounded-md px-3 py-2",
                    item.active
                      ? "text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {actions && (
              <div className="flex items-center space-x-4">{actions}</div>
            )}

            {items.length > 0 && (
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {isMobileMenuOpen && items.length > 0 && (
          <div className="absolute top-full left-0 w-full z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-lg md:hidden">
            <div className="px-4 py-2 space-y-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block w-full text-left text-sm font-medium transition-colors duration-200 rounded-md px-3 py-2",
                    item.active
                      ? "text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    );
  }
);

Navbar.displayName = "Navbar";
export default Navbar;
