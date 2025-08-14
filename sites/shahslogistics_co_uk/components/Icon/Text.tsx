import React from 'react';
import { Mail, Phone, MapPin, type LucideIcon } from 'lucide-react';

/**
 * Defines the props for the IconText component.
 */
interface IconTextProps {
  /**
   * The name of the icon to display.
   * Only 'mail', 'phone', or 'map-pin' are currently supported based on usage context.
   */
  iconName: 'mail' | 'phone' | 'map-pin';
  /**
   * The text content to display next to the icon.
   */
  text: string;
  /**
   * Optional Tailwind CSS classes to apply to the container div for custom styling.
   */
  className?: string;
}

/**
 * A mapping of icon names (strings) to their corresponding LucideIcon components.
 * This ensures that only allowed and relevant icons are used and are properly typed.
 */
const iconMapping: { [key in IconTextProps['iconName']]: LucideIcon } = {
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
};

/**
 * IconText component displays an icon aligned with a line of text.
 * It's designed to be reusable for various pieces of information like contact details.
 *
 * @param {IconTextProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered component, or null if the iconName is invalid.
 */
const IconText: React.FC<IconTextProps> = ({ iconName, text, className }) => {
  // Retrieve the IconComponent from the mapping based on iconName.
  // The type assertion as `keyof typeof iconMapping` ensures type safety with the mapping.
  const IconComponent = iconMapping[iconName as keyof typeof iconMapping];

  // If the IconComponent is not found, log a warning and return null to prevent rendering an error.
  if (!IconComponent) {
    // eslint-disable-next-line no-console
    console.warn(`Icon "${iconName}" is not a valid icon for the IconText component.`);
    return null;
  }

  return (
    // The main container for the icon and text, using flexbox for alignment.
    // Tailwind classes apply Open Sans font, a dark gray color, and a base text size,
    // as per blueprint's "p-text, Open-Sans-font, Dark-gray-color" styles.
    <div
      className={`
        flex items-center gap-2
        text-base font-sans leading-normal
        text-[#3B3B3B]
        ${className ?? ''}
      `}
    >
      {/*
        The icon itself.
        Tailwind classes set its size, color, and prevent it from shrinking.
        The color #575757 provides a slightly lighter dark gray for the icon.
      */}
      <IconComponent className="w-5 h-5 text-[#575757] flex-shrink-0" />
      {/* The text content displayed next to the icon. */}
      <span>{text}</span>
    </div>
  );
};

export default IconText;