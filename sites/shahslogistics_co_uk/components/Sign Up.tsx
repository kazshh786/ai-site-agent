import Link from 'next/link';
import type { MouseEventHandler } from 'react';

/**
 * Props for the SignUp component.
 * Infers 'variant', 'size' from the 'Sign Up' button in the blueprint.
 * 'fullWidth' is inferred from other button types (e.g., login submit button) for reusability.
 * 'text' and 'link' are considered inherent to the 'Sign Up' component's name and purpose,
 * thus they are hardcoded internally rather than being configurable props.
 */
interface SignUpProps {
  /**
   * Defines the visual style of the button.
   * 'primary' for main actions (e.g., Get Started, Sign Up).
   * 'secondary' for less prominent actions (e.g., Login in header).
   * 'outline' for bordered buttons (e.g., Book a Demo).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline';
  /**
   * Defines the size of the button.
   * 'small' for compact buttons.
   * 'medium' for standard size.
   * 'large' for prominent calls to action.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If true, the button will take up the full width of its parent container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Optional click handler for additional side effects when the button is clicked.
   */
  onClick?: () => void;
  /**
   * Optional CSS classes to apply to the button for custom styling.
   */
  className?: string;
}

/**
 * A reusable React component for a "Sign Up" button.
 * It uses Next.js's <Link> for internal navigation and Tailwind CSS for styling.
 * The button text is fixed to "Sign Up" and the link to "/signup".
 */
const SignUp: React.FC<SignUpProps> = ({
  variant = 'primary', // Default variant based on C_SignUpBtn in blueprint
  size = 'medium', // Default size based on C_SignUpBtn in blueprint
  fullWidth = false,
  onClick,
  className,
}) => {
  // Base styling for all button variants
  const baseClasses: string =
    'inline-flex items-center justify-center font-semibold rounded-md transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  // Variant-specific styling
  const variantClasses: Record<NonNullable<SignUpProps['variant']>, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:ring-gray-400',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500',
  };

  // Size-specific styling
  const sizeClasses: Record<NonNullable<SignUpProps['size']>, string> = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  // Full width styling
  const fullWidthClass: string = fullWidth ? 'w-full' : '';

  // Combine all applicable class names
  const combinedClasses: string =
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidthClass} ${className || ''}`.trim();

  // The 'Sign Up' button always links to '/signup'
  const linkHref: string = '/signup';
  const buttonText: string = 'Sign Up';

  // Cast onClick for Link component, as its onClick signature is more specific
  // The consumer's onClick is a simple callback, so we can pass it directly.
  const handleOnClick: MouseEventHandler<HTMLAnchorElement> | undefined = onClick
    ? (event) => {
        onClick();
      }
    : undefined;

  return (
    <Link href={linkHref} className={combinedClasses} onClick={handleOnClick}>
      {buttonText}
    </Link>
  );
};

export default SignUp;