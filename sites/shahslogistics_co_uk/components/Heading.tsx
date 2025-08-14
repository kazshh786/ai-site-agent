import React from 'react';

/**
 * HeadingProps interface defines the props for the Heading component.
 * It strictly types the `children` (content), `level` (HTML heading tag),
 * and an optional `className` for additional Tailwind styling.
 * The `level` prop determines the semantic HTML heading element to be rendered,
 * while the `className` prop is intended to carry all the parsed Tailwind
 * utility classes derived from the website blueprint's `componentStyles`.
 */
interface HeadingProps {
  /**
   * The content to be displayed within the heading.
   * This corresponds to the `componentContent` in the blueprint.
   */
  children: React.ReactNode;
  /**
   * The semantic heading level (e.g., 'h1' for primary titles, 'h2' for section titles).
   * This corresponds to styles like `h1-text` or `h2-text` in the blueprint.
   */
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * An optional string of Tailwind CSS classes to apply to the heading.
   * This prop is where processed blueprint styles (like 'Poppins-font', 'White-color')
   * are passed as Tailwind classes (e.g., 'font-poppins text-white').
   */
  className?: string;
}

/**
 * Heading component for Shahs Logistics website.
 * This reusable component dynamically renders an HTML heading element (h1-h6)
 * based on the `level` prop, and applies base heading styles along with
 * any additional Tailwind classes passed via the `className` prop.
 *
 * @param {HeadingProps} props - The props for the Heading component.
 * @returns {JSX.Element} A React element representing the heading.
 */
const Heading: React.FC<HeadingProps> = ({ children, level, className }) => {
  // Base Tailwind classes applied to all headings for structural consistency.
  // 'relative' is added for potential future positioning or before/after pseudo-elements.
  const baseClasses: string = 'relative';

  // HeadingTag dynamically determines the HTML element type (h1, h2, etc.).
  // levelClasses defines the default responsive font sizes and weights for each heading level.
  let HeadingTag: keyof JSX.IntrinsicElements;
  let levelClasses: string;

  // Assign specific Tailwind classes based on the heading level.
  // These styles are designed to be responsive using `md:` and `lg:` prefixes.
  switch (level) {
    case 'h1':
      HeadingTag = 'h1';
      levelClasses = 'text-4xl md:text-5xl lg:text-6xl font-extrabold';
      break;
    case 'h2':
      HeadingTag = 'h2';
      levelClasses = 'text-3xl md:text-4xl lg:text-5xl font-bold';
      break;
    case 'h3':
      HeadingTag = 'h3';
      levelClasses = 'text-2xl md:text-3xl lg:text-4xl font-semibold';
      break;
    case 'h4':
      HeadingTag = 'h4';
      levelClasses = 'text-xl md:text-2xl lg:text-3xl font-medium';
      break;
    case 'h5':
      HeadingTag = 'h5';
      levelClasses = 'text-lg md:text-xl lg:text-2xl font-medium';
      break;
    case 'h6':
      HeadingTag = 'h6';
      levelClasses = 'text-base md:text-lg lg:text-xl font-medium';
      break;
    default:
      // Fallback for an unexpected `level` value, though TypeScript should prevent this.
      HeadingTag = 'h1';
      levelClasses = 'text-5xl font-extrabold';
  }

  // Combine base classes, level-specific classes, and any custom classes.
  // `.trim()` is used to remove any leading/trailing whitespace.
  const combinedClasses: string = `${baseClasses} ${levelClasses} ${className || ''}`.trim();

  // Render the dynamic HTML heading element with the combined Tailwind classes and its children.
  return (
    <HeadingTag className={combinedClasses}>
      {children}
    </HeadingTag>
  );
};

export default Heading;