import React from "react";

/**
 * Properties for the Paragraph component.
 */
interface ParagraphProps {
  /**
   * The content to be rendered inside the paragraph.
   * This is typically the text for the paragraph.
   */
  children: React.ReactNode;
  /**
   * Optional Tailwind CSS classes to customize the paragraph&apos;s appearance.
   * This allows for variations like text size (e.g., `text-base`, `text-lg`),
   * font family (e.g., `font-['Open_Sans']`), and color (e.g., `text-gray-700`).
   * Classes provided here will extend or override the default styling.
   */
  className?: string;
}

/**
 * A reusable Paragraph component for Shahs Logistics.
 * It renders text content with standard typography and allows for customization
 * via Tailwind CSS classes.
 *
 * It uses the Open Sans font (as per `fontFamilyBody` in the blueprint) and a
 * dark gray color (as per `Dark-gray-color` in component styles).
 *
 * @param {ParagraphProps} props - The properties for the Paragraph component.
 * @returns {JSX.Element} A React component that displays a paragraph.
 */
const Paragraph: React.FC<ParagraphProps> = ({ children, className }) => {
  // Base Tailwind classes for all paragraphs.
  // - `font-['Open_Sans']`: Maps to `Open-Sans-font` from the blueprint.
  // - `text-gray-700`: Maps to `Dark-gray-color` from the blueprint.
  // - `text-base`: A default size for `p-text`.
  // - `leading-relaxed`: Improves readability for longer text.
  const defaultClasses: string = "font-['Open_Sans'] text-gray-700 text-base leading-relaxed";

  // Merge default classes with any custom classes provided via the `className` prop.
  // Custom classes will take precedence if there are conflicts.
  const mergedClasses: string = `${defaultClasses} ${className || ""}`.trim();

  return (
    <p className={mergedClasses}>{children}</p>
  );
};

export default Paragraph;