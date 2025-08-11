import Link from 'next/link';
import React from 'react';

/**
 * Props for the GetStarted component, defining its text, destination link,
 * visual variant, and size.
 */
interface GetStartedProps {
  /** The text displayed inside the button. */
  text: string;
  /** The URL to navigate to when the button is clicked. */
  link: string;
  /** The visual style variant of the button. */
  variant: 'primary' | 'secondary' | 'outline';
  /** The size of the button. */
  size: 'small' | 'medium' | 'large';
  /** Optional additional CSS classes for custom styling. */
  className?: string;
}

/**
 * A reusable button component designed for calls to action,
 * specifically like a "Get Started" button. It leverages Next.js's Link
 * component for internal navigation and Tailwind CSS for flexible styling.
 */
const GetStarted: React.FC<GetStartedProps> = ({ text, link, variant, size, className }) => {
  // Base styles applied to all button variants and sizes
  const baseStyles: string = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Styles specific to different button sizes
  const sizeStyles: Record<GetStartedProps['size'], string> = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-2 text-base',
    large: 'px-8 py-3 text-lg',
  };

  // Styles specific to different button variants
  const variantStyles: Record<GetStartedProps['variant'], string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  // Combine all relevant styles
  const combinedClasses: string = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className || ''}`;

  return (
    <Link href={link} className={combinedClasses}>
      {text}
    </Link>
  );
};

export default GetStarted;