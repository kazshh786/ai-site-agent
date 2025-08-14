import React from "react";

/**
 * Props for the Map component.
 * Based on the blueprint, the `props` object for this component is empty.
 * Therefore, we only include the standard `className` prop for external styling.
 * The specific location (Shahs Logistics HQ) and interactivity (zoom, pan) are
 * implicitly part of this component&apos;s design based on the `componentContent`
 * and `componentInteractivity` in the blueprint.
 */
interface MapProps {
  /**
   * Optional string of Tailwind CSS classes to apply to the map container.
   * This allows for custom styling such as width, height, and aspect ratio,
   * aligning with `componentStyles: "Full-width, Aspect-ratio-16-9"`.
   */
  className?: string;
}

/**
 * A reusable Map component designed to display a Google Map for
 * Shahs Logistics HQ, supporting basic zoom and pan interactivity.
 * The location is hardcoded as per the blueprint&apos;s empty `props` and
 * specific `componentContent` for the "Map" component.
 */
const Map: React.FC<MapProps> = ({ className }) => {
  // Hardcoded location for Shahs Logistics HQ based on the blueprint's description:
  // "Google Map (Shahs Logistics HQ)" and "Address: 123 Logistics St, City, Country"
  const shahLogisticsHQAddress: string = "123 Logistics St, City, Country";
  // The map embed URL allows for zooming and panning.
  // The 'z' parameter controls the initial zoom level. 'ie=UTF8' and 'iwloc='
  // are common for embed links. 'output=embed' is crucial for embedding.
  const mapEmbedUrl: string = `https://maps.google.com/maps?q=${encodeURIComponent(
    shahLogisticsHQAddress
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  // Apply default and custom Tailwind CSS classes for full-width and aspect ratio.
  const combinedClassName: string = `w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] aspect-video border-none rounded-lg shadow-md ${
    className || ""
  }`;

  return (
    // The iframe is wrapped in a div to ensure the aspect-ratio and styling apply correctly
    // especially for responsiveness and layout within different parent containers.
    <div className={combinedClassName}>
      {/*
        The iframe embeds the Google Map.
        `title` is important for accessibility.
        `loading="lazy"` helps with performance by loading the map only when it's near the viewport.
        `referrerPolicy="no-referrer-when-downgrade"` is a common security practice for iframes.
      */}
      <iframe
        title="Map to Shahs Logistics HQ"
        src={mapEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full rounded-lg"
        // No additional `allow` attributes are specified or required by blueprint interactivity,
        // as standard pan/zoom are usually allowed by default for map embeds.
      />
    </div>
  );
};

export default Map;