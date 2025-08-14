"use client";

import * as React from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

/**
 * @typedef ButtonProps
 * @property {React.ReactNode} children - The content inside the button.
 * @property {() => void} [onClick] - Optional click handler for the button.
 * @property {string} [href] - Optional URL for navigation; if provided, renders a Next.js Link component.
 * @property {"button" | "submit" | "reset"} [type] - Specifies the type of the button (e.g., "submit", "button"). Defaults to "button".
 * @property {"primary" | "secondary" | "outline" | "ghost"} [variant] - Defines the visual style of the button.
 *   - "primary": Uses the accent color as background (`#F4B860`).
 *   - "secondary": Uses the primary brand color as background (`#233D4D`).
 *   - "outline": Transparent background with accent color border and text.
 *   - "ghost": Transparent background with accent color text.
 *   Defaults to "primary".
 * @property {"sm" | "md" | "lg"} [size] - Defines the size of the button (small, medium, large). Defaults to "lg".
 * @property {string} [className] - Additional Tailwind CSS classes to apply to the button.
 * @property {boolean} [disabled] - Whether the button is disabled. Defaults to `false`.
 *
 * Note: Assumes the following custom colors are configured in `tailwind.config.ts`:
 *   - `shahs-primary`: #233D4D (Dark Blue)
 *   - `shahs-secondary`: #A7D7C5 (Light Green)
 *   - `shahs-accent`: #F4B860 (Orange)
 *   - `shahs-text`: #EFEFEF (Light Gray)
 */
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

/**
 * A reusable React Button component with Tailwind CSS styling, supporting various sizes,
 * variants, and optional Next.js Link integration.
 *
 * @component
 * @param {ButtonProps} props - The props for the Button component.
 * @returns {JSX.Element} The rendered button or link component.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  href,
  type = "button",
  variant = "primary",
  size = "lg",
  className,
  disabled = false,
}) => {
  // Base styles for all buttons
  const baseClasses =
    "inline-flex items-center justify-center font-semibold text-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed";

  // Size-specific styles
  const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-lg", // Rounded-corners applied here
  };

  // Variant-specific styles
  const variantClasses: Record<"primary" | "secondary" | "outline" | "ghost", string> = {
    primary: "bg-shahs-accent text-shahs-text hover:bg-shahs-accent/90 focus:ring-shahs-accent", // Orange-background
    secondary: "bg-shahs-primary text-shahs-text hover:bg-shahs-primary/90 focus:ring-shahs-primary",
    outline:
      "border border-shahs-accent text-shahs-accent hover:bg-shahs-accent hover:text-shahs-text focus:ring-shahs-accent",
    ghost: "text-shahs-accent hover:bg-shahs-accent/10 focus:ring-shahs-accent",
  };

  // Combine base, size, variant, and custom classes using tailwind-merge
  // Also include the hover scale for "On-hover scale" interactivity
  const combinedClasses = twMerge(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    "hover:scale-105",
    className
  );

  // Render a Next.js Link component if an href is provided, otherwise render a standard button
  if (href) {
    return (
      <Link href={href} className={combinedClasses} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClasses} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;