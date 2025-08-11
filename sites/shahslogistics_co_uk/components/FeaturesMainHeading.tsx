import * as React from 'react';

/**
 * Props for the FeaturesMainHeading component.
 * @interface FeaturesMainHeadingProps
 * @property {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} level - The HTML heading level (e.g., 'h1', 'h2').
 * @property {string} text - The main text content of the heading.
 */
interface FeaturesMainHeadingProps {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text: string;
}

/**
 * A reusable React component for displaying main headings, typically used in hero sections or feature overviews.
 * It dynamically renders the specified HTML heading level (`h1`-`h6`) with Tailwind CSS for modern styling.
 *
 * @component
 * @example
 * <FeaturesMainHeading level="h1" text="Powerful Features for Modern Logistics" />
 *
 * @param {FeaturesMainHeadingProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered heading component.
 */
const FeaturesMainHeading: React.FC<FeaturesMainHeadingProps> = ({ level, text }) => {
  // Dynamically select the HTML heading tag based on the 'level' prop.
  const Tag = level as keyof JSX.IntrinsicElements;

  // Base Tailwind CSS classes for consistent styling across all heading levels.
  const baseClasses: string = 'font-extrabold text-gray-900 text-center mx-auto';

  // Responsive size classes for each heading level, ensuring visual hierarchy.
  // These are designed to scale down on smaller screens (mobile first).
  const sizeClasses: Record<typeof level, string> = {
    h1: 'text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 md:mb-8 max-w-4xl',
    h2: 'text-3xl md:text-4xl lg:text-5xl leading-tight mb-5 md:mb-7 max-w-3xl',
    h3: 'text-2xl md:text-3xl lg:text-4xl leading-snug mb-4 md:mb-6 max-w-2xl',
    h4: 'text-xl md:text-2xl lg:text-3xl leading-snug mb-3 md:mb-5 max-w-xl',
    h5: 'text-lg md:text-xl lg:text-2xl leading-snug mb-2 md:mb-4 max-w-lg',
    h6: 'text-base md:text-lg lg:text-xl leading-snug mb-1 md:mb-3 max-w-md',
  };

  // Combine base and level-specific size classes.
  const combinedClasses: string = `${baseClasses} ${sizeClasses[level]}`;

  // Escape special characters for JSX text content as per instructions.
  const escapedText: string = text.replace(/'/g, '&apos;').replace(/"/g, '&quot;');

  return (
    <Tag className={combinedClasses}>
      {/* Render the escaped text content */}
      {escapedText}
    </Tag>
  );
};

export default FeaturesMainHeading;