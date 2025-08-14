import Link from "next/link";
import React from "react";

/**
 * Interface for the Link component's props.
 * Defines the type and structure of properties expected by the Link component.
 */
interface LinkProps {
  /**
   * The destination URL or path that the link points to.
   * This is a mandatory prop.
   */
  href: string;
  /**
   * The content to be rendered inside the link. This can be text, other React components,
   * or a combination of both.
   * This is a mandatory prop.
   */
  children: React.ReactNode;
  /**
   * Optional string of Tailwind CSS classes to be applied to the link.
   * These classes will be combined with the component's default styling.
   * Default value is an empty string if not provided.
   */
  className?: string;
  /**
   * Optional target attribute for the underlying <a> tag (e.g., "_blank" to open in a new tab/window).
   */
  target?: string;
  /**
   * Optional rel attribute for the underlying <a> tag (e.g., "noopener noreferrer" for security).
   * It's automatically added for external links opened in a new tab if not explicitly provided.
   */
  rel?: string;
  /**
   * Optional click event handler for the link.
   * This function will be called when the link is clicked.
   */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

/**
 * A versatile React/Next.js Link component for Shahs Logistics,
 * meticulously styled with Tailwind CSS. It supports both internal
 * navigation via Next.js <Link> and external links using standard <a> tags,
 * ensuring proper styling and accessibility.
 *
 * It is designed to be reusable across the Shahs Logistics website,
 * applying a light-gray text color with a subtle hover underline effect.
 *
 * @param {LinkProps} props - The properties for the Link component, including href, children, and optional styling/behavior.
 * @returns {JSX.Element} The rendered Link component.
 */
const LinkComponent: React.FC<LinkProps> = ({
  href,
  children,
  className = "",
  target,
  rel,
  onClick,
}) => {
  // Base styles for the Link component, derived from the blueprint's "Text-link, Light-gray-color".
  // `font-open-sans` is assumed to be defined in Tailwind config based on the branding.
  // `text-gray-400` provides the light-gray color.
  // `hover:text-gray-300` and `hover:underline` provide a clean hover effect.
  // `cursor-pointer` explicitly indicates an interactive element.
  // `transition-colors` and `duration-200` provide a smooth color change on hover.
  const baseClasses: string =
    "font-open-sans cursor-pointer transition-colors duration-200 text-gray-400 hover:text-gray-300 hover:underline";

  // Combine base styles with any custom classes provided via the `className` prop.
  // `trim()` removes any leading/trailing whitespace if `className` is empty.
  const combinedClasses: string = `${baseClasses} ${className}`.trim();

  // Determine if the link is an external URL (starting with "http://", "https://", or "mailto:").
  const isExternal: boolean =
    href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:");

  // Render a standard <a> tag for external links.
  if (isExternal) {
    // Default rel to "noopener noreferrer" for security if target is "_blank" and rel is not provided.
    const defaultRel: string | undefined =
      rel === undefined && (target === "_blank" || target === undefined)
        ? "noopener noreferrer"
        : rel;

    return (
      <a
        href={href}
        className={combinedClasses}
        // If target is not explicitly set for an external link, default to "_blank".
        target={target === undefined ? "_blank" : target}
        rel={defaultRel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  // Render Next.js <Link> for internal navigation.
  return (
    <Link
      href={href}
      className={combinedClasses}
      target={target} // Pass target directly to Next.js Link
      rel={rel} // Pass rel directly to Next.js Link
      onClick={onClick}
      // Next.js <Link> automatically passes its props (including `className`, `target`, `rel`, `onClick`)
      // down to the underlying `<a>` element it renders.
    >
      {children}
    </Link>
  );
};

export default LinkComponent;