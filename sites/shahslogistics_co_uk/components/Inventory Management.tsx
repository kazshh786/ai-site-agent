import React from 'react';
import { Truck, MapPin, ArrowRight, Zap, LucideIcon } from 'lucide-react';

/**
 * Interface for the props of the InventoryManagement component.
 * The 'icon' prop accepts specific string values as defined in the blueprint,
 * which are then mapped to corresponding Lucide icons internally.
 */
interface InventoryManagementProps {
  heading: string;
  description: string;
  icon: 'box' | 'globe' | 'route' | 'chart-bar'; // Blueprint's specified icon names
}

/**
 * A mapping from blueprint icon names (which might not be direct Lucide names)
 * to available and semantically appropriate Lucide-React icon components.
 * This ensures compliance with the allowed icon list.
 */
const iconMap: { [key: string]: LucideIcon } = {
  box: Truck, // Semantic substitution for inventory/logistics
  globe: MapPin, // Semantic substitution for tracking/location
  route: ArrowRight, // Semantic substitution for routes/direction
  'chart-bar': Zap, // Semantic substitution for analytics/performance
};

/**
 * The InventoryManagement component displays a feature card with an icon,
 * a heading, and a description. It's designed to be reusable for various
 * features, aligning with the 'FeatureCard' type in the blueprint.
 *
 * @param {InventoryManagementProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered feature card.
 */
const InventoryManagement: React.FC<InventoryManagementProps> = ({ heading, description, icon }) => {
  const IconComponent = iconMap[icon];

  // If for some reason the icon string does not map to a component, provide a fallback or handle gracefully.
  // Although TypeScript types should prevent this for known 'icon' values, it's good practice for robustness.
  if (!IconComponent) {
    console.warn(`InventoryManagement: No icon found for "${icon}". Using Truck as fallback.`);
    // Fallback to a default icon, or render nothing for the icon
    // For this specific case, as it's typed to known values, this branch is largely defensive.
    return null; // Or return a card without an icon, or with a default one
  }

  return (
    <div
      className="
        bg-white p-6 rounded-lg shadow-lg hover:shadow-xl
        transition-shadow duration-300 ease-in-out
        flex flex-col items-center text-center
        border border-gray-100
        w-full max-w-sm mx-auto
      "
    >
      {/* Icon */}
      <div className="mb-4">
        <IconComponent className="text-blue-600 h-12 w-12" />
      </div>

      {/* Heading */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{heading}</h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default InventoryManagement;