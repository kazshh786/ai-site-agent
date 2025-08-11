"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';

/**
 * Interface for a single item within the user profile dropdown.
 */
interface UserProfileDropdownItem {
  label: string; // The display text for the menu item
  link: string;  // The URL to navigate to when the item is clicked
}

/**
 * Props interface for the UserProfile component.
 */
interface UserProfileProps {
  label: string; // The main label displayed for the user profile dropdown (e.g., "User Profile", "John Doe")
  items: UserProfileDropdownItem[]; // An array of dropdown menu items
}

/**
 * A reusable React component for a user profile dropdown, typically found in a header or sidebar.
 * It displays a label (e.g., user's name or "User Profile") and, when clicked,
 * reveals a dropdown menu with navigation links.
 *
 * @param {UserProfileProps} props - The properties for the component.
 * @returns {JSX.Element} The UserProfile React component.
 */
const UserProfile: React.FC<UserProfileProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Toggles the dropdown menu's open state.
   */
  const toggleDropdown = (): void => {
    setIsOpen((prev) => !prev);
  };

  /**
   * Handles clicks outside the dropdown to close it.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left z-20" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center gap-2 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          id="user-profile-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          <User className="h-5 w-5 text-gray-500" aria-hidden="true" />
          <span>{label}</span>
          <ChevronDown
            className={`-mr-1 ml-1 h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-profile-menu-button"
        >
          <div className="py-1" role="none">
            {items.map((item: UserProfileDropdownItem, index: number) => (
              <Link
                key={index} // Using index as key for simplicity, consider unique IDs if items can be reordered/deleted
                href={item.link}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-100 ease-in-out"
                role="menuitem"
                onClick={() => setIsOpen(false)} // Close dropdown when an item is clicked
              >
                {/* Dynamically render icons based on common item labels */}
                {item.label === 'Settings' && <Settings className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />}
                {item.label === 'Logout' && <LogOut className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;