import React from 'react';
import {
  Menu, X, ChevronDown, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Check, Star, Users, Truck, Bot, Cpu, Zap
} from 'lucide-react';

// Define a union type for all allowed Lucide icon names as strings.
type AllowedLucideIconName =
  | 'Menu'
  | 'X'
  | 'ChevronDown'
  | 'Mail'
  | 'Phone'
  | 'MapPin'
  | 'Facebook'
  | 'Twitter'
  | 'Linkedin'
  | 'Instagram'
  | 'ArrowRight'
  | 'Check'
  | 'Star'
  | 'Users'
  | 'Truck'
  | 'Bot'
  | 'Cpu'
  | 'Zap';

// A record mapping string icon names to their respective Lucide React component.
// This allows dynamic rendering of icons based on a string prop.
const lucideIconMap: Record<AllowedLucideIconName, React.ElementType> = {
  Menu, X, ChevronDown, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Check, Star, Users, Truck, Bot, Cpu, Zap
};

/**
 * Props for the RealTimeTracking component.
 * Inferred from the "Real-time Tracking" component's props object in the blueprint.
 */
interface RealTimeTrackingProps {
  heading: string;
  description: string;
  icon: string; // The blueprint specifies "globe", which is not in the allowed list.
                // This component will attempt to render the specified icon,
                // but will fall back to `MapPin` if the icon name is not allowed
                // or recognized from the `lucideIconMap`.
}

/**
 * A reusable React component representing a feature card for "Real-time Tracking".
 * It displays an icon, a heading, and a description.
 *
 * @param {RealTimeTrackingProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered feature card.
 */
const RealTimeTracking: React.FC<RealTimeTrackingProps> = ({ heading, description, icon }) => {
  // Determine which icon component to render.
  // We cast the incoming `icon` string to `AllowedLucideIconName` for type checking against our map.
  // If the provided icon string is not found in our `lucideIconMap` (e.g., "globe" from the blueprint),
  // we default to the `MapPin` icon, as it is relevant for "Real-time Tracking" and is on the allowed list.
  const SelectedIcon: React.ElementType = (lucideIconMap as Record<string, React.ElementType>)[icon as AllowedLucideIconName] || MapPin;

  return (
    <div className="flex flex-col items-start p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      {/* Icon Container */}
      <div className="flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 text-indigo-600 rounded-full">
        <SelectedIcon size={24} />
      </div>

      {/* Heading */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {heading}
      </h3>

      {/* Description */}
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default RealTimeTracking;