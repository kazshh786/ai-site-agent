import React from 'react';

/**
 * Props for the MainHeroHeading component.
 */
interface MainHeroHeadingProps {
  /**
   * The HTML heading level to render (e.g., 'h1' for the main hero heading).
   * @example 'h1' | 'h2'
   */
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * The text content for the heading.
   * @example "Streamline Your Logistics Operations"
   */
  text: string;
  /**
   * Optional Tailwind CSS classes to apply to the heading element.
   * These will override default styles where applicable.
   * @example 'text-blue-500'
   */
  className?: string;
}

/**
 * `MainHeroHeading` is a reusable React component for displaying prominent,
 * styled headings, typically used in hero sections of web pages.
 * It dynamically renders the appropriate HTML heading tag (h1-h6) based on the `level` prop.
 *
 * @param {MainHeroHeadingProps} props - The props for the component.
 * @returns {JSX.Element} A heading element with dynamic content and styling.
 */
const MainHeroHeading = ({ level, text, className }: MainHeroHeadingProps) => {
  // Dynamically determine the HTML tag based on the 'level' prop.
  const Tag = level as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  // Base Tailwind CSS classes for a hero heading.
  // These styles are chosen for impact and readability, commonly used over a background image.
  const baseStyles: string = `
    font-extrabold        /* Extra bold font weight for strong visual presence */
    leading-tight         /* Tight line height for a compact and modern look */
    text-center           /* Center align the heading text */
    text-white            /* Default white text for contrast against a typical dark hero background image */
    drop-shadow-lg        /* A subtle text shadow to enhance readability over complex backgrounds */
    mb-4                  /* Margin bottom for spacing from subsequent elements (default) */
    md:mb-6               /* Larger margin bottom on medium screens and up */
  `;

  // Responsive font sizes tailored for different heading levels.
  // 'h1' is designed to be very large for the main hero prominence.
  let levelStyles: string;
  switch (level) {
    case 'h1':
      levelStyles = 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'; // Largest for hero sections
      break;
    case 'h2':
      levelStyles = 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl';
      break;
    case 'h3':
      levelStyles = 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl';
      break;
    case 'h4':
      levelStyles = 'text-xl sm:text-2xl md:text-3xl lg:text-4xl';
      break;
    case 'h5':
      levelStyles = 'text-lg sm:text-xl md:text-2xl lg:text-3xl';
      break;
    case 'h6':
      levelStyles = 'text-base sm:text-lg md:text-xl lg:text-2xl';
      break;
    default:
      levelStyles = 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'; // Fallback to h1 style for unknown levels
      break;
  }

  // Combine base styles, level-specific styles, and any additional `className` prop.
  // `trim()` removes any leading/trailing whitespace.
  const combinedClasses: string = `${baseStyles} ${levelStyles} ${className || ''}`.trim();

  // Replace specific characters in the text content to prevent JSX parsing issues.
  // Apostrophes are replaced with '&apos;' and double quotes with '&quot;'.
  const escapedText: string = text.replace(/'/g, '&apos;').replace(/"/g, '&quot;');

  return (
    <Tag className={combinedClasses}>
      {escapedText}
    </Tag>
  );
};

export default MainHeroHeading;
