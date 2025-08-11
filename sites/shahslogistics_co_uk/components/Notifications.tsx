"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mail, Users, Star, Check } from 'lucide-react';

/**
 * Maps blueprint icon names to available Lucide React icons.
 * This handles the constraint where specific icons like "bell" are not available
 * and substitutes them with a suitable allowed alternative (e.g., Mail).
 */
const IconMap: { [key: string]: React.ElementType } = {
  bell: Mail, // Substituting 'bell' with 'Mail' as a general notification indicator
  mail: Mail,
  users: Users,
  star: Star,
  check: Check,
  // Add other allowed icons if they are ever expected via iconName prop:
  // menu: Menu,
  // x: X,
  // chevrondown: ChevronDown,
  // phone: Phone,
  // mappin: MapPin,
  // facebook: Facebook,
  // twitter: Twitter,
  // linkedin: Linkedin,
  // instagram: Instagram,
  // arrowright: ArrowRight,
  // truck: Truck,
  // bot: Bot,
  // cpu: Cpu,
  // zap: Zap,
};

interface NotificationsProps {
  /**
   * The name of the icon to display. As per the blueprint, this is "bell".
   * Due to icon library constraints, "bell" is mapped to the 'Mail' icon.
   * Other allowed Lucide icons (e.g., "mail", "users") would render directly.
   */
  iconName: string;
  /**
   * The number of unread notifications to display in a badge. Defaults to 0 if not provided.
   */
  count?: number;
}

/**
 * A reusable React component for displaying notifications with a count badge
 * and a dropdown for potential notification lists.
 * It adheres to the provided blueprint props and styling guidelines.
 */
const Notifications: React.FC<NotificationsProps> = ({ iconName, count = 0 }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * Toggles the visibility of the notifications dropdown.
   */
  const toggleDropdown = (): void => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  useEffect(() => {
    /**
     * Handles clicks outside the component to close the dropdown.
     * @param event The mouse event.
     */
    const handleClickOutside = (event: MouseEvent): void => {
      // Close dropdown if click is outside the dropdown and outside the button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine which icon to render based on `iconName` prop and `IconMap`.
  // Falls back to `Mail` if the provided `iconName` isn't found or mapped.
  const CurrentIcon: React.ElementType = IconMap[iconName.toLowerCase()] || Mail;

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
        aria-label={`Notifications, you have ${count} unread`}
        aria-expanded={isOpen}
      >
        <CurrentIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        {count > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:scale-105 transition-transform">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-72 md:w-80 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-50 ring-1 ring-black ring-opacity-5 animate-fade-in-down"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>
          <div className="py-1">
            {count === 0 ? (
              <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No new notification&apos;s.
              </p>
            ) : (
              <div className="px-4 py-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  You have {count} unread notification{count > 1 ? '&apos;s' : ''}.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This area would typically list individual notification &quot;cards&quot; from a data source.
                </p>
              </div>
            )}
          </div>
          {count > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-600 text-center">
              <button
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center justify-center w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1 transition-colors duration-200"
                onClick={() => {
                  alert('Mark all as read action triggered!');
                  setIsOpen(false); // Close dropdown after action
                }}
              >
                <Check className="h-4 w-4 mr-1" aria-hidden="true" /> Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;