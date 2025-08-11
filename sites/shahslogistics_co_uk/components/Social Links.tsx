import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

/**
 * Defines the structure for a single social media link.
 */
interface SocialLink {
  /**
   * The platform name, used to select the correct icon.
   * Restricted to platforms for which icons are available.
   */
  platform: "Twitter" | "LinkedIn" | "Facebook" | "Instagram";
  /**
   * The URL for the social media profile.
   */
  url: string;
}

/**
 * Props for the SocialLinks component.
 */
interface SocialLinksProps {
  /**
   * An array of social media links to display.
   */
  links: SocialLink[];
  /**
   * Optional Tailwind CSS classes to apply to the main container div.
   */
  className?: string;
  /**
   * Optional Tailwind CSS classes to apply to each individual social icon.
   * Defaults to 'w-6 h-6 text-gray-400 hover:text-blue-500 transition-colors duration-200'.
   */
  iconClassName?: string;
}

/**
 * A mapping from social platform names to their corresponding Lucide React icon components.
 */
const socialIconMap = {
  Twitter: Twitter,
  LinkedIn: Linkedin,
  Facebook: Facebook,
  Instagram: Instagram,
};

/**
 * A reusable React component to display a list of social media links.
 * It renders icons for specified platforms, linking to their respective URLs.
 *
 * @param {SocialLinksProps} props - The props for the SocialLinks component.
 * @returns {React.FC<SocialLinksProps>} The Social Links component.
 */
const SocialLinks: React.FC<SocialLinksProps> = ({
  links,
  className = '',
  iconClassName = 'w-6 h-6 text-gray-400 hover:text-blue-500 transition-colors duration-200',
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {links.map((link: SocialLink, index: number) => {
        const IconComponent = socialIconMap[link.platform];

        // Only render if a corresponding icon component is found
        if (!IconComponent) {
          // In a production app, you might want to log this or render a fallback.
          // For this exercise, we'll simply skip rendering the link.
          return null;
        }

        return (
          <a
            key={index} // Using index as key is acceptable here since the list is static and order doesn't change
            href={link.url}
            target="_blank" // Open links in a new tab
            rel="noopener noreferrer" // Security best practice for target="_blank"
            aria-label={`Visit Shahs Logistics on ${link.platform}`} // Accessibility label
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full" // Focus state for accessibility
          >
            <IconComponent className={iconClassName} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;