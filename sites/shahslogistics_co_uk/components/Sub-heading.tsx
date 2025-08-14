import React from 'react';

/**
 * Props for the SubHeading component.
 */
interface SubHeadingProps {
  /**
   * The text content of the sub-heading.
   */
  text: string;
  /**
   * The size of the sub-heading text.
   * 'large' corresponds to 'p-text-large', 'medium' to 'p-text'.
   * @default 'medium'
   */
  size?: 'large' | 'medium';
  /**
   * The color of the sub-heading text.
   * 'light' corresponds to 'Light-gray-color', 'dark' to 'Dark-gray-color'.
   * @default 'dark'
   */
  color?: 'light' | 'dark';
  /**
   * Additional Tailwind CSS classes to apply to the sub-heading.
   */
  className?: string;
}

/**
 * A reusable sub-heading component designed for Shahs Logistics.
 * It features adjustable text size and color and uses the Open Sans font,
 * aligning with the provided design system.
 */
const SubHeading: React.FC<SubHeadingProps> = ({
  text,
  size = 'medium',
  color = 'dark',
  className,
}) => {
  // Determine the Tailwind class for text size based on the 'size' prop.
  const textSizeClass: string = size === 'large' ? 'text-xl' : 'text-base';

  // Determine the Tailwind class for text color based on the 'color' prop.
  // Using Tailwind's gray shades to represent 'Light-gray-color' and 'Dark-gray-color'.
  const textColorClass: string = color === 'light' ? 'text-gray-300' : 'text-gray-700';

  // The font family specified in the blueprint is 'Open Sans'.
  const fontClass: string = 'font-sans'; // Assumes `font-sans` is configured to Open Sans in tailwind.config.js or via direct import.

  // Combine all base classes and any additional classes provided via 'className'.
  // Using filter(Boolean) to remove any potential empty strings before joining.
  const combinedClasses: string = [
    textSizeClass,
    textColorClass,
    fontClass,
    className,
  ].filter(Boolean).join(' ');

  // Sub-heading component
  return (
    <p className={combinedClasses}>
      {text}
    </p>
  );
};

export default SubHeading;