"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'; // Importing Menu and X icons from lucide-react

/**
 * Interface for Header component props.
 * Currently empty as the component does not require any specific props,
 * but defined as per critical instruction.
 */
interface HeaderProps {}

/**
 * Header component for Shahs Logistics.
 * Displays a navigation bar with a client name, navigation links,
 * and a responsive mobile menu with a hamburger icon.
 */
const Header: React.FC<HeaderProps> = () => {
  // State for controlling the visibility of the mobile navigation menu.
  // `isOpen` is a boolean, and `setIsOpen` is a state setter function.
  const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  /**
   * Toggles the state of the mobile navigation menu (open/closed).
   * Fully typed to ensure a `void` return.
   */
  const toggleMenu: () => void = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Defines the navigation links with their display names and corresponding paths.
   * This is an array of objects, with each object having `name` (string) and `path` (string) properties.
   */
  const navLinks: { name: string; path: string; }[] = [
    { name: 'Homepage', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Login', path: '/login' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Client Name/Logo */}
        <Link href="/" className="text-2xl font-extrabold text-gray-800 hover:text-gray-900 transition-colors duration-200" onClick={() => setIsOpen(false)}>
          Shahs Logistics
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 relative
                         after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gray-800 after:scale-x-0
                         after:w-full hover:after:scale-x-100 after:transition-transform after:duration-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 hover:text-gray-900 transition-colors duration-200"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation (conditional rendering based on isOpen state) */}
      <div
        className={`md:hidden overflow-hidden transition-max-h duration-500 ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <nav className="p-4 bg-gray-50 border-t border-gray-100">
          <ul className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  onClick={toggleMenu} // Close menu when a link is clicked
                  className="block text-gray-700 hover:text-gray-900 font-medium text-lg px-2 py-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;