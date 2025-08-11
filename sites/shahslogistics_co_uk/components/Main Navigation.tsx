"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  link: string;
}

interface MainNavigationProps {
  items: NavItem[];
}

/**
 * Renders the main navigation menu for the website.
 * Features a responsive design with a hamburger menu for smaller screens.
 *
 * @param {MainNavigationProps} props - The properties for the component.
 * @param {NavItem[]} props.items - An array of navigation items, each with a label and a link.
 */
const MainNavigation: React.FC<MainNavigationProps> = ({ items }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const pathname: string = usePathname();

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <ul className="hidden md:flex md:items-center md:space-x-8 lg:space-x-12">
        {items.map((item: NavItem) => (
          <li key={item.link}>
            <Link
              href={item.link}
              className={`
                text-sm font-medium transition-colors duration-200
                ${
                  pathname === item.link
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                }
              `}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="p-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-300"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-95 md:hidden dark:bg-gray-900 dark:bg-opacity-95">
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-300"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <ul className="flex flex-col items-center space-y-6 pt-10">
            {items.map((item: NavItem) => (
              <li key={item.link}>
                <Link
                  href={item.link}
                  onClick={toggleMenu} // Close menu on item click
                  className={`
                    text-2xl font-semibold transition-colors duration-200
                    ${
                      pathname === item.link
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-gray-800 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
                    }
                  `}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default MainNavigation;