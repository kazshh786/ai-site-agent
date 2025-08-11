import React from 'react';

/**
 * Props for the PricingMainHeading component.
 * @interface PricingMainHeadingProps
 */
interface PricingMainHeadingProps {
  /**
   * The HTML heading level to render. The blueprint specifies 'h1' for this component,
   * but the component supports other heading levels for broader reusability as a 'Heading' type.
   */
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * The main text content for the heading.
   */
  text: string;
}

/**
 * A reusable React component for the main heading on the Pricing page.
 * It dynamically renders the specified HTML heading level with Tailwind CSS styling
 * for a modern, professional, and centered appearance.
 *
 * @param {PricingMainHeadingProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered heading component.
 */
const PricingMainHeading: React.FC<PricingMainHeadingProps> = ({ level, text }) => {
  // Dynamically determine the HTML tag to render based on the 'level' prop
  const HeadingTag = level;

  // Base Tailwind CSS classes for general styling common to all heading levels
  const baseClasses = 'font-extrabold text-gray-900 text-center mb-8 px-4';

  // Apply responsive font sizes based on the heading level.
  // These sizes are chosen to be prominent for a main hero heading.
  let sizeClasses = '';
  switch (level) {
    case 'h1':
      sizeClasses = 'text-4xl md:text-5xl lg:text-6xl tracking-tight';
      break;
    case 'h2':
      sizeClasses = 'text-3xl md:text-4xl lg:text-5xl';
      break;
    case 'h3':
      sizeClasses = 'text-2xl md:text-3xl lg:text-4xl';
      break;
    case 'h4':
      sizeClasses = 'text-xl md:text-2xl lg:text-3xl';
      break;
    case 'h5':
      sizeClasses = 'text-lg md:text-xl lg:text-2xl';
      break;
    case 'h6':
      sizeClasses = 'text-base md:text-lg lg:text-xl';
      break;
    default:
      // Fallback to h1 styling if an unsupported level is provided
      sizeClasses = 'text-4xl md:text-5xl lg:text-6xl tracking-tight';
      break;
  }

  // Combine all Tailwind CSS classes
  const combinedClasses = `${baseClasses} ${sizeClasses}`;

  return (
    <HeadingTag className={combinedClasses}>
      {text}
    </HeadingTag>
  );
};

export default PricingMainHeading;