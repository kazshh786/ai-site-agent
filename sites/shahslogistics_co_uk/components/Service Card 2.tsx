import React from 'react';
import { Truck, Check, Zap, Users } from 'lucide-react'; // ONLY use these available lucide-react icons

/**
 * ServiceCard2Props interface for the Service Card 2 component.
 * Infers prop names and types from the full website blueprint context,
 * allowing the component to be reusable for various services.
 */
interface ServiceCard2Props {
  /**
   * The title of the service. E.g., &quot;Warehousing&quot;.
   */
  title: string;
  /**
   * A brief description of the service.
   */
  description: string;
  /**
   * The name of the Lucide icon to display at the top of the card.
   * Must be one of the allowed icons and relevant to logistics.
   */
  iconName: 'Truck' | 'Check' | 'Zap' | 'Users';
  /**
   * Optional additional CSS classes to apply to the top-level container for custom styling or layout.
   */
  className?: string;
}

/**
 * Map icon names to their respective Lucide React components.
 * This ensures only allowed icons are used and provides type safety.
 */
const ICON_COMPONENTS = {
  Truck: Truck,
  Check: Check,
  Zap: Zap,
  Users: Users,
} as const; // Ensure this object is treated as read-only

/**
 * Service Card 2 component for Shahs Logistics, displaying a service with an icon, title, and description.
 * It features an &quot;On-hover elevate&quot; interactivity with Tailwind CSS transitions.
 *
 * This component is designed based on the blueprint entry for &quot;Service Card 2&quot; which indicates
 * &quot;Warehousing&quot; content, an &quot;Icon-top&quot; layout, and &quot;Text-center&quot; alignment.
 *
 * @param {ServiceCard2Props} props - The properties for the ServiceCard2 component.
 */
const ServiceCard2: React.FC<ServiceCard2Props> = ({ title, description, iconName, className }) => {
  // Dynamically select the icon component based on the prop
  const IconComponent = ICON_COMPONENTS[iconName];

  return (
    // Top-level container for the card, with styling for elevation on hover
    <div
      className={`
        bg-white
        shadow-lg
        rounded-lg
        p-6
        flex
        flex-col
        items-center
        text-center
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-xl
        ${className || ''}
      `}
    >
      {/* Icon component, styled with an accent color from the branding */}
      <IconComponent className="size-12 mb-4 text-[#F4B860]" />

      {/* Service title, styled with Poppins font and a dark blue color from the branding */}
      <h3
        className={`
          font-['Poppins']
          text-xl
          font-semibold
          leading-tight
          mb-2
          text-[#233D4D]
        `}
      >
        {title}
      </h3>

      {/* Service description, styled with Open Sans font and a dark gray color */}
      <p
        className={`
          font-['Open_Sans']
          text-base
          leading-relaxed
          text-gray-800
        `}
      >
        {description}
      </p>
    </div>
  );
};

export default ServiceCard2;