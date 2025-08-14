import NextImage from 'next/image';

/**
 * @interface ImageProps
 * @description Props for the reusable Image component.
 * @property {string} src - The URL or path of the image. Required.
 * @property {string} alt - The alternative text for the image, crucial for accessibility. Required.
 * @property {string} [componentStyles] - A comma-separated string describing high-level styles (e.g., "Full-width, Aspect-ratio-16-9").
 * @property {string} [className] - Additional Tailwind CSS classes to be applied directly to the image container.
 * @property {boolean} [priority=false] - When true, the image is considered a "priority" image and will be loaded with higher priority by Next.js.
 * @property {number} [quality=75] - The quality of the optimized image (0-100). Default is 75.
 */
interface ImageProps {
  src: string;
  alt: string;
  componentStyles?: string; // e.g., "Full-width, Aspect-ratio-16-9"
  className?: string; // Additional custom classes to be merged on the parent container
  priority?: boolean;
  quality?: number;
}

/**
 * @function Image
 * @description A reusable React component for displaying images using Next.js `next/image` with Tailwind CSS.
 * It dynamically adjusts styling based on a `componentStyles` string.
 * It uses the `fill` prop of `next/image` and therefore requires a parent container with relative positioning and defined dimensions.
 * For "Full-width" images without an explicit aspect ratio, it defaults to `aspect-video` (16:9).
 *
 * @param {ImageProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered image component.
 */
const Image: React.FC<ImageProps> = ({
  src,
  alt,
  componentStyles,
  className,
  priority = false,
  quality = 75,
}) => {
  // Base classes for the image container, required for `fill` prop
  const containerClasses: string[] = ['relative'];
  let hasSpecificAspectRatio = false;

  // Parse componentStyles string to apply appropriate Tailwind classes
  if (componentStyles) {
    const styles = componentStyles.split(', ').map(s => s.trim());

    if (styles.includes('Full-width')) {
      containerClasses.push('w-full');
    }

    if (styles.includes('Aspect-ratio-16-9')) {
      containerClasses.push('aspect-video'); // Tailwind's aspect-video utility provides 16:9 ratio
      hasSpecificAspectRatio = true;
    }

    // Default aspect ratio for full-width images if no specific aspect ratio is provided
    if (styles.includes('Full-width') && !hasSpecificAspectRatio) {
      containerClasses.push('aspect-video'); // Fallback to 16:9 for full-width images
    }

    if (styles.includes('Rounded-corners')) {
      containerClasses.push('rounded-md');
    }

    // Note: Other descriptive styles would be added here if present in the blueprint
    // e.g., 'Circular', 'Square', 'Shadow' etc.
  } else {
    // If no componentStyles are provided, apply reasonable defaults
    containerClasses.push('w-full', 'aspect-video');
  }

  // Combine component-generated classes with any custom classes passed through the `className` prop
  const finalContainerClasses = `${containerClasses.join(' ')} ${className || ''}`;

  return (
    // The parent div provides the relative positioning and dimensions for the Next.js Image
    <div className={finalContainerClasses.trim()}>
      <NextImage
        src={src}
        alt={alt}
        fill // Causes the image to fill the parent container
        className="object-cover" // Ensures the image covers the container while maintaining aspect ratio
        priority={priority}
        quality={quality}
        // `sizes` property is crucial for `fill` images for proper image optimization and responsiveness
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
      />
    </div>
  );
};

export default Image;