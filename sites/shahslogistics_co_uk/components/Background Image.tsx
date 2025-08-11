import Image from 'next/image';
import React from 'react';

// Define the interface for the component's props based on the blueprint
interface BackgroundImageProps {
  imageSrc: string;
  imageAlt: string;
  /**
   * Optional React nodes to be rendered on top of the background image.
   * These children will be centered horizontally and vertically within the component's bounds by default.
   */
  children?: React.ReactNode;
  /**
   * Optional Tailwind CSS classes to apply to the main container div.
   * Use this to control the dimensions (e.g., h-96, min-h-screen, w-full)
   * or add custom padding/margin to the overall background area.
   * Defaults to a height suitable for hero sections.
   */
  className?: string;
  /**
   * Optional Tailwind CSS class for an overlay color (e.g., 'bg-black/50', 'bg-blue-500/30').
   * This overlay is placed between the background image and the children
   * to improve text readability on top of the image.
   * Defaults to a semi-transparent dark overlay.
   */
  overlayClassName?: string;
}

/**
 * A reusable React component to display an image as a full-bleed background
 * for a section, with an optional overlay and content rendered on top.
 *
 * It utilizes `next/image` for optimized image loading and Tailwind CSS for styling.
 */
const BackgroundImage: React.FC<BackgroundImageProps> = ({
  imageSrc,
  imageAlt,
  children,
  className = 'h-96 md:h-[500px] lg:h-[600px] w-full', // Default height for hero-like sections, full width
  overlayClassName = 'bg-black/40', // Default semi-transparent dark overlay for readability
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Image (Next.js Image component) */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill // Make the image fill the entire container
        priority // Prioritize loading for images typically above the fold (like hero backgrounds)
        className="object-cover object-center pointer-events-none" // Cover, center, and ignore pointer events on the image
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw" // Responsive image sizes for better performance
      />

      {/* Optional Overlay for Readability */}
      <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden="true"></div>

      {/* Content container (children) */}
      {children && (
        <div className="relative z-10 h-full flex items-center justify-center">
          {/* The content (children) will be placed here.
              The `flex items-center justify-center` classes center the children.
              Children components should handle their own max-width, padding, etc.,
              e.g., using `max-w-screen-xl mx-auto px-4` for typical section content.
          */}
          {children}
        </div>
      )}
    </div>
  );
};

export default BackgroundImage;