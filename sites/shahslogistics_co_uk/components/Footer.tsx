import React from 'react';
import Link from 'next/link';

interface FooterProps {}

interface NavLinkItem {
  name: string;
  href: string;
}

const navLinks: NavLinkItem[] = [
  { name: 'Homepage', href: '/' },
  { name: 'Features Page', href: '/features' },
  { name: 'Pricing Page', href: '/pricing' },
  { name: 'Login Page', href: '/login' },
  { name: 'Dashboard Page', href: '/dashboard' },
];

const Footer: React.FC<FooterProps> = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-sm">
          &copy; {currentYear} Unknown. All rights reserved.
        </div>
        <nav>
          <ul className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            {navLinks.map((link: NavLinkItem) => (
              <li key={link.name}>
                <Link href={link.href} className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;