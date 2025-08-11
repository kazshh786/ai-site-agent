import React from 'react';
import {
  Menu, X, ChevronDown, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram,
  ArrowRight, Check, Star, Users, Truck, Bot, Cpu, Zap
} from 'lucide-react';

// Define a type for the Lucide icon components that are explicitly allowed.
// This helps ensure type safety when mapping string names to actual components.
type LucideIconComponent =
  | typeof Menu
  | typeof X
  | typeof ChevronDown
  | typeof Mail
  | typeof Phone
  | typeof MapPin
  | typeof Facebook
  | typeof Twitter
  | typeof Linkedin
  | typeof Instagram
  | typeof ArrowRight
  | typeof Check
  | typeof Star
  | typeof Users
  | typeof Truck
  | typeof Bot
  | typeof Cpu
  | typeof Zap;

// A mapping object that translates string names (including those from the blueprint
// that are not directly available as Lucide icons) to their corresponding allowed Lucide components.
const iconMap: Record<string, LucideIconComponent> = {
  // The blueprint specifies "chart-bar" for the icon. Since "chart-bar" is not in
  // the allowed list of Lucide icons, we must choose a suitable alternative from the list.
  // 'Zap' is chosen here as it conveys a sense of power, efficiency, and insight, fitting for "Advanced Reporting".
  'chart-bar': Zap,

  // Mappings for all explicitly allowed Lucide icons by their string names.
  'Menu': Menu,
  'X': X,
  'ChevronDown': ChevronDown,
  'Mail': Mail,
  'Phone': Phone,
  'MapPin': MapPin,
  'Facebook': Facebook,
  'Twitter': Twitter,
  'Linkedin': Linkedin,
  'Instagram': Instagram,
  'ArrowRight': ArrowRight,
  'Check': Check,
  'Star': Star,
  'Users': Users,
  'Truck': Truck,
  'Bot': Bot,
  'Cpu': Cpu,
  'Zap': Zap,
};

/**
 * Props interface for the AdvancedReporting component.
 * Prop names and types are inferred directly from the 'props' object
 * of the "Advanced Reporting" component found in the provided blueprint.
 */
interface AdvancedReportingProps {
  heading: string;
  description: string;
  // The 'icon' prop is typed as 'string' because the blueprint specifies
  // its value as the string "chart-bar". The component's internal logic
  // handles the mapping of this string to an available Lucide icon.
  icon: string;
}

/**
 * AdvancedReporting Component
 *
 * This component displays information about an "Advanced Reporting" feature,
 * typically used as a feature card or similar content block. It dynamically
 * renders an icon, a heading, and a description.
 *
 * @param {AdvancedReportingProps} props - The properties for the component.
 * @param {string} props.heading - The main title or heading for the feature.
 * @param {string} props.description - A detailed description of the feature.
 * @param {string} props.icon - The string name of the icon to display. This string
 *   will be mapped to an available Lucide icon component, with "chart-bar"
 *   being specifically mapped to the 'Zap' icon as per instructions.
 */
const AdvancedReporting: React.FC<AdvancedReportingProps> = ({ heading, description, icon }) => {
  // Retrieve the appropriate Lucide icon component from the iconMap.
  // If the provided `icon` string does not have a direct mapping (e.g., if an unsupported
  // string other than "chart-bar" is passed), it defaults to the 'Zap' icon.
  const IconComponent: LucideIconComponent = iconMap[icon] || Zap;

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm mx-auto">
      {/* Icon Display Area */}
      {/* `mb-4` provides space below the icon. `text-blue-600` sets the icon's color,
          assuming a brand primary blue for visual emphasis. */}
      <div className="mb-4 text-blue-600">
        {/* Render the selected Lucide icon.
            `size={48}` makes the icon prominently visible.
            `strokeWidth={1.5}` adjusts the line thickness for a refined look. */}
        <IconComponent size={48} strokeWidth={1.5} />
      </div>

      {/* Heading */}
      {/* `text-xl` for a medium-large heading size, `font-semibold` for boldness,
          `text-gray-900` for a dark, readable text color, `mb-2` for spacing below. */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {heading}
      </h3>

      {/* Description */}
      {/* `text-gray-600` for a slightly softer, yet readable, text color.
          `text-base` for standard paragraph text size. */}
      <p className="text-gray-600 text-base">
        {description}
      </p>
    </div>
  );
};

export default AdvancedReporting;