import Link from 'next/link';

/**
 * Interface for a single navigation item within the footer.
 */
interface NavItem {
  label: string;
  link: string;
}

/**
 * Props for the FooterNavigation component.
 */
interface FooterNavigationProps {
  items: NavItem[];
}

/**
 * A reusable React component for displaying navigation links in a footer.
 * It's designed to be responsive, stacking links vertically on small screens
 * and horizontally on larger screens.
 *
 * @param {FooterNavigationProps} props - The properties for the component.
 * @param {NavItem[]} props.items - An array of navigation items, each with a label and a link.
 */
const FooterNavigation = ({ items }: FooterNavigationProps): JSX.Element => {
  return (
    <nav aria-label="Footer navigation links" className="text-center md:text-left">
      <ul className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 text-sm">
        {items.map((item: NavItem, index: number) => (
          <li key={index}>
            <Link
              href={item.link}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FooterNavigation;