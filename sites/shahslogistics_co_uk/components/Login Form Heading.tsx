import React from 'react';

/**
 * Props for the LoginFormHeading component.
 */
interface LoginFormHeadingProps {
  /**
   * The HTML heading level to render (e.g., 'h1', 'h2', 'h3').
   * This determines the semantic importance and default size of the heading.
   */
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * The text content for the heading.
   */
  text: string;
  /**
   * Optional additional CSS classes to apply to the heading element.
   * These classes will be merged with the component's default Tailwind styles.
   */
  className?: string;
}

/**
 * A reusable React component for displaying a login form heading.
 * It dynamically renders an HTML heading element (h1-h6) with
 * modern, professional styling using Tailwind CSS.
 *
 * @param {LoginFormHeadingProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered heading component.
 */
const LoginFormHeading: React.FC<LoginFormHeadingProps> = ({ level: HeadingTag, text, className }) => {
  // Base Tailwind CSS classes for a professional and bold heading style.
  // mb-6 provides standard spacing below the heading in a form context.
  // text-center centers the text, common for form headings.
  const baseClasses: string = 'font-bold text-gray-900 mb-6 text-center';

  // Determine the font size based on the 'level' prop.
  let sizeClass: string = '';
  switch (HeadingTag) {
    case 'h1':
      sizeClass = 'text-4xl sm:text-5xl';
      break;
    case 'h2':
      // The blueprint specifies 'h2' with text "Welcome Back!",
      // so a large but not 'h1'-level size is appropriate.
      sizeClass = 'text-3xl sm:text-4xl';
      break;
    case 'h3':
      sizeClass = 'text-2xl sm:text-3xl';
      break;
    case 'h4':
      sizeClass = 'text-xl sm:text-2xl';
      break;
    case 'h5':
      sizeClass = 'text-lg sm:text-xl';
      break;
    case 'h6':
      sizeClass = 'text-base sm:text-lg';
      break;
    default:
      // Fallback in case an invalid level is provided (though TypeScript should prevent this).
      sizeClass = 'text-3xl sm:text-4xl';
  }

  // Combine all class names: base, size, and any custom classes from props.
  // trim() removes any leading/trailing whitespace if className is empty.
  const combinedClasses: string = `${baseClasses} ${sizeClass} ${className || ''}`.trim();

  // Render the dynamic heading tag with the combined classes and text content.
  // No character escaping needed for "Welcome Back!" as it contains no apostrophes or quotes.
  return (
    <HeadingTag className={combinedClasses}>
      {text}
    </HeadingTag>
  );
};

export default LoginFormHeading;