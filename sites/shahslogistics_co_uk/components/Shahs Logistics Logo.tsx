"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

/**
 * Props for the ShahsLogisticsLogo component.
 * @interface ShahsLogisticsLogoProps
 * @property {string} imageSrc - The source URL of the logo image. This is a required prop
 *                               as defined in the website blueprint.
 * @property {string} imageAlt - The alternative text for the logo image, essential for accessibility.
 *                               This is a required prop as defined in the website blueprint.
 * @property {string} [link="/"] - Optional: The URL the logo links to. Defaults to the homepage ("/").
 *                                  This allows the logo to navigate users, a common UI pattern.
 * @property {string} [className=""] - Optional: Additional Tailwind CSS classes to apply to the
 *                                      root `Link` element, allowing for external styling customization.
 * @property {number} [width=150] - Optional: The explicit width of the image in pixels for the
 *                                   `next/image` component. Defaults to 150px for a standard logo size.
 * @property {number} [height=40] - Optional: The explicit height of the image in pixels for the
 *                                    `next/image` component. Defaults to 40px for a standard logo size.
 */
interface ShahsLogisticsLogoProps {
  imageSrc: string;
  imageAlt: string;
  link?: string;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * `ShahsLogisticsLogo` is a reusable React component designed to display
 * the Shahs Logistics brand logo. It leverages Next.js's `Link` for
 * optimized navigation and `Image` for performant image loading.
 *
 * The component is styled with Tailwind CSS, ensuring a clean, professional,
 * and responsive appearance. It is set up as a Server Component by default,
 * as it does not utilize client-side React Hooks like `useState` or `useEffect`.
 *
 * @param {ShahsLogisticsLogoProps} props - The properties passed to the component.
 * @returns {JSX.Element} A React element representing the Shahs Logistics logo.
 */
const ShahsLogisticsLogo: React.FC<ShahsLogisticsLogoProps> = ({
  imageSrc,
  imageAlt,
  link = "/", // Default to linking to the homepage
  className = "", // Default to no additional classes
  width = 150, // Default width for typical header placement
  height = 40, // Default height for typical header placement
}) => {
  return (
    <Link
      href={link}
      className={`block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded ${className}`}
      aria-label={imageAlt} // Provides an accessible label for the link
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={width}
        height={height}
        className="object-contain" // Ensures the image scales within its bounds without cropping
        priority // Prioritizes loading the logo as it's often a critical asset in the header
      />
    </Link>
  );
};

export default ShahsLogisticsLogo;