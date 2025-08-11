import Link from 'next/link';
import React from 'react'; // Explicitly import React for React.FC type

/**
 * Props for the BookADemo component.
 * It represents a call-to-action button to book a demo, with customizable styling.
 */
interface BookADemoProps {
  /**
   * The URL to navigate to when the button is clicked.
   * Defaults to '/book-demo' as per the blueprint.
   */
  link?: string;
  /**
   * The visual style variant of the button.
   * 'primary' for main actions, 'secondary' for alternative, 'outline' for bordered, 'ghost' for minimal.
   * Defaults to 'outline' as per the blueprint.
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /**
   * The size of the button.
   * 'small', 'medium', or 'large'.
   * Defaults to 'large' as per the blueprint.
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Additional Tailwind CSS classes to apply to the button for further customization.
   */
  className?: string;
  /**
   * Optional click handler for the button.
   */
  onClick?: () => void;
}

/**
 * A reusable React component for a "Book a Demo" call-to-action button.
 * It's styled with Tailwind CSS and uses Next.js's Link component for navigation.
 */
const BookADemo: React.FC<BookADemoProps> = ({
  link = '/book-demo', // Default link as per blueprint
  variant = 'outline', // Default variant as per blueprint
  size = 'large', // Default size as per blueprint
  className = '',
  onClick,
}) => {
  // Base styles applied to all button variants and sizes
  const baseStyles: string =
    'inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Styles for different button sizes
  const sizeStyles: Record<typeof size, string> = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-5 py-2.5 text-base',
    large: 'px-6 py-3 text-lg',
  };

  // Styles for different button variants
  const variantStyles: Record<typeof variant, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    ghost: 'text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
  };

  // Combine all applicable styles
  const combinedStyles: string = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <Link href={link} passHref legacyBehavior>
      {/* The <a> tag is necessary for semantic HTML and accessibility when wrapping with Link */}
      <a className={combinedStyles} onClick={onClick}>
        Book a Demo
      </a>
    </Link>
  );
};

export default BookADemo;