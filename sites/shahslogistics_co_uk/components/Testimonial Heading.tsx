import React from 'react';

// Define the allowed HTML heading levels for strong typing.
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Props for the TestimonialHeading component.
 * These props are inferred directly from the "Testimonial Heading"
 * component's definition in the provided blueprint.
 */
interface TestimonialHeadingProps {
  /**
   * The HTML heading level to render (e.g., 'h1', 'h2').
   * This determines the semantic importance and base styling of the heading.
   */
  level: HeadingLevel;
  /**
   * The text content of the heading. This string will be displayed
   * within the chosen HTML heading tag.
   */
  text: string;
  /**
   * Optional additional CSS classes to apply to the heading element.
   * This allows for custom styling overrides or extensions from the parent component.
   */
  className?: string;
}

/**
 * TestimonialHeading component.
 * A reusable React component designed to display a heading for a testimonial section.
 * It dynamically renders the appropriate HTML heading tag (h1-h6) based on the `level` prop,
 * and applies modern, responsive Tailwind CSS for visual appeal.
 *
 * This component strictly adheres to character escaping rules for JSX text content.
 */
const TestimonialHeading: React.FC<TestimonialHeadingProps> = ({ level, text, className }) => {
  // Dynamically select the HTML heading tag based on the 'level' prop.
  // This allows the component to render as <h1>, <h2>, etc., programmatically.
  const HeadingTag = level;

  // Base Tailwind CSS classes applied to all heading levels for consistency.
  // text-gray-900 for dark text on light backgrounds, with a dark mode variant.
  const baseClasses: string = 'font-bold text-center text-gray-900 dark:text-gray-50';
  let sizeClasses: string = '';

  // Determine the appropriate responsive text size based on the heading level.
  // These sizes are chosen to be visually appealing and hierarchical for a website.
  switch (level) {
    case 'h1':
      sizeClasses = 'text-4xl md:text-5xl lg:text-6xl';
      break;
    case 'h2':
      // As per the blueprint, the Testimonial Heading uses 'h2', so these are the default sizes.
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
      // Fallback for any unsupported or unexpected `level` values,
      // defaulting to the h2 styling as it's the common use case.
      sizeClasses = 'text-3xl md:text-4xl lg:text-5xl';
  }

  // Combine all CSS classes: base styles, size-specific styles, and any custom classes.
  // `trim()` removes any leading/trailing spaces that might result from empty `className`.
  const combinedClasses: string = `${baseClasses} ${sizeClasses} ${className || ''}`.trim();

  // CRITICAL INSTRUCTION: Handle character escaping for JSX text content.
  // Replace apostrophes and double quotes with their specific HTML entities
  // as mandated by the instructions.
  const escapedText: string = text
    .replace(/'/g, '&apos;') // Replace single quotes with &apos;
    .replace(/"/g, '&quot;'); // Replace double quotes with &quot;

  // Render the heading element using React.createElement for dynamic tag name.
  // `dangerouslySetInnerHTML` is used to inject the pre-escaped text string,
  // ensuring adherence to the specific character escaping requirements.
  return React.createElement(
    HeadingTag, // The dynamically determined HTML tag (e.g., 'h2')
    {
      className: combinedClasses, // Apply the combined Tailwind CSS classes
      dangerouslySetInnerHTML: { __html: escapedText }, // Inject the escaped text content
    }
  );
};

export default TestimonialHeading;