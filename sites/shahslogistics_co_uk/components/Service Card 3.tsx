import React from "react";
import { Check } from "lucide-react"; // Only allowed icon from the blueprint

// Define the component's props interface based on the blueprint and context.
// - title: Represents the "Component Content" ("Customs Clearance").
// - description: Inferred from "designNotes": "3-column grid of service cards with icons and descriptions".
// - Icon: The icon component to display, based on "Icon-top" style and available icons.
interface ServiceCard3Props {
  title: string;
  description: string;
  Icon: React.ElementType; // To pass a Lucide Icon component as a prop
}

/**
 * Service Card 3 - Reusable component for Shahs Logistics.
 * Displays a service with an icon on top, a title, and a description.
 * Features: Centered text, rounded corners, shadow, and an "elevate" effect on hover.
 */
const ServiceCard3: React.FC<ServiceCard3Props> = ({ title, description, Icon }) => {
  return (
    // Main card container with Tailwind styles for layout, appearance, and hover effect.
    // - `bg-white`: A clean background, assuming it sits on the light-green section background.
    // - `p-6 md:p-8`: Responsive padding.
    // - `rounded-lg`: Standard rounded corners.
    // - `shadow-lg`: Initial shadow for depth.
    // - `flex flex-col items-center justify-center`: Centers content both horizontally and vertically within the card.
    // - `text-center`: Aligns all text inside the card to the center.
    // - `transition-all duration-300 ease-in-out`: Smooth transition for the hover effect.
    // - `transform hover:-translate-y-2 hover:shadow-2xl`: "On-hover elevate" effect.
    <div
      className="
        bg-white p-6 md:p-8 rounded-lg shadow-lg
        flex flex-col items-center justify-center text-center
        transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl
      "
    >
      {/* Icon for the service */}
      {/* - `mb-4`: Margin bottom for spacing from the title. */}
      {/* - `w-12 h-12`: Standard size for the icon. */}
      {/* - `text-[#F4B860]`: Uses the accent color from the branding for the icon. */}
      {/* - `aria-hidden="true"`: As the icon is decorative, it's hidden from screen readers. */}
      <Icon className="mb-4 w-12 h-12 text-[#F4B860]" aria-hidden="true" />

      {/* Title of the service */}
      {/* - `font-poppins`: Font family from the blueprint. */}
      {/* - `text-xl md:text-2xl`: Responsive font size. */}
      {/* - `font-semibold`: Boldness for the heading. */}
      {/* - `text-[#233D4D]`: Uses the primary color from the branding for heading text. */}
      {/* - `mb-2`: Margin bottom for spacing from the description. */}
      <h3 className="font-poppins text-xl md:text-2xl font-semibold text-[#233D4D] mb-2">
        {title}
      </h3>

      {/* Description of the service */}
      {/* - `font-open-sans`: Font family from the blueprint. */}
      {/* - `text-base`: Standard font size for paragraph text. */}
      {/* - `text-gray-600`: A neutral dark gray, representing "Dark-gray-color" for body text. */}
      <p className="font-open-sans text-base text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard3;