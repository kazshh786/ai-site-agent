import React from 'react';

/**
 * Props for the DashboardMainTitle component.
 */
interface DashboardMainTitleProps {
  /**
   * The heading level to render (e.g., 'h1', 'h2', 'h3').
   * The blueprint specifies 'h1' for the main dashboard title.
   */
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * The text content for the dashboard main title.
   * From the blueprint: "Dashboard Overview".
   */
  text: string;
  /**
   * Optional additional Tailwind CSS classes to apply to the heading element.
   */
  className?: string;
}

/**
 * A reusable React component for displaying the main title on dashboard pages.
 * It renders a heading element with specific styling based on the provided props.
 */
const DashboardMainTitle: React.FC<DashboardMainTitleProps> = ({ level, text, className }) => {
  // Dynamically select the HTML heading tag based on the 'level' prop.
  const HeadingTag = level;

  // Base Tailwind CSS classes for the main dashboard title:
  // - text-3xl: Sets a large font size.
  // - font-bold: Makes the text bold.
  // - text-gray-900: Defines a dark text color for high contrast.
  // - tracking-tight: Reduces letter spacing slightly for a more refined look.
  // - mb-6: Adds margin-bottom for spacing below the title.
  const baseClasses = 'text-3xl font-bold text-gray-900 tracking-tight mb-6';

  return (
    <HeadingTag className={`${baseClasses} ${className || ''}`}>
      {text}
    </HeadingTag>
  );
};

export default DashboardMainTitle;