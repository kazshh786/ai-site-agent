import Link from 'next/link';

/**
 * Props for the Footer component.
 * Although empty, it adheres to the critical instruction of defining a props interface.
 */
interface FooterProps {}

/**
 * Represents the footer section of the application.
 * Displays copyright information and navigation links.
 */
const Footer: React.FC<FooterProps> = (): React.ReactElement => {
  const currentYear: number = new Date().getFullYear();

  interface NavLink {
    name: string;
    href: string;
  }

  const navLinks: NavLink[] = [
    { name: 'Homepage', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Login', href: '/login' },
  ];

  return (
    <footer className="bg-gray-800 text-gray-300 p-6 sm:p-8 mt-12">
      <div className="container mx-auto flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-4">
        {/* Copyright notice */}
        <p className="text-sm font-light">
          &copy; {currentYear} Shahs Logistics. All rights reserved.
        </p>

        {/* Navigation links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium">
          {navLinks.map((link: NavLink): React.ReactElement => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors duration-200">
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;