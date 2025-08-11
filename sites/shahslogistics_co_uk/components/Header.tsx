"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'; // Assuming lucide-react is installed

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'Homepage', href: '/' },
    { name: 'Features Page', href: '/features' },
    { name: 'Pricing Page', href: '/pricing' },
    { name: 'Login Page', href: '/login' },
    { name: 'Dashboard Page', href: '/dashboard' },
  ];

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Client Name / Logo */}
        <div className="text-xl font-bold">
          <Link href="/" className="hover:text-gray-300">
            Unknown
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-gray-300 transition-colors duration-200">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none focus:ring-2 focus:ring-gray-400 p-2 rounded-md"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation (conditionally rendered) */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-gray-700 py-4 px-4 pb-6">
          <ul className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="block text-white hover:bg-gray-600 px-3 py-2 rounded-md transition-colors duration-200"
                  onClick={toggleMobileMenu} // Close menu on link click
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;