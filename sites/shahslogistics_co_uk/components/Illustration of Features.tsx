import Image from "next/image";
import React from "react";

/**
 * Props for the IllustrationOfFeatures component.
 */
interface IllustrationOfFeaturesProps {
  /**
   * The source URL for the illustration image.
   */
  imageSrc: string;
  /**
   * The alt text for the illustration image, crucial for accessibility.
   */
  imageAlt: string;
  /**
   * The desired width of the image. Defaults to 700 if not provided.
   */
  width?: number;
  /**
   * The desired height of the image. Defaults to 500 if not provided.
   */
  height?: number;
  /**
   * Optional className for additional styling on the container div.
   */
  className?: string;
}

/**
 * A reusable React component to display an illustration, typically used to visually
 * represent features or concepts on a page. It leverages Next.js's Image component
 * for optimized image loading and styling with Tailwind CSS.
 */
const IllustrationOfFeatures: React.FC<IllustrationOfFeaturesProps> = ({
  imageSrc,
  imageAlt,
  width = 700, // Sensible default width for an illustration
  height = 500, // Sensible default height, maintains a common aspect ratio
  className,
}) => {
  return (
    <div
      className={`relative w-full flex items-center justify-center p-4 ${
        className || ""
      }`}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={width}
        height={height}
        // Tailwind classes for responsive styling and visual appeal
        className="object-contain max-w-full h-auto rounded-lg shadow-xl"
        // Priority for important images, but for an illustration it might not be strictly necessary
        // priority={true}
      />
    </div>
  );
};

export default IllustrationOfFeatures;