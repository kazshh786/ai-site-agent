"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users, // Used for 'home' (overview) and 'user' (drivers)
  Truck, // Used for 'truck' (shipments)
  Cpu,   // Used for 'chart' (analytics)
} from "lucide-react";
import React from "react";

// Define the shape of a single navigation item based on the blueprint
interface NavItem {
  label: string;
  link: string;
  // The 'icon' string directly corresponds to the blueprint's icon names.
  // We will map these strings to actual Lucide React components.
  icon: "home" | "truck" | "user" | "chart";
}

// Define the props for the DashboardSidebarNav component
interface DashboardSidebarNavProps {
  items: NavItem[];
}

// Map the blueprint's icon string names to the available Lucide React components.
// This mapping respects the constraint of using only the allowed Lucide icons.
const iconMap: { [key: string]: React.ElementType } = {
  home: Users, // 'home' is not allowed, so 'Users' (representing a group/dashboard) is chosen as a suitable alternative.
  truck: Truck,
  user: Users, // 'user' maps directly to 'Users' (can represent individual drivers).
  chart: Cpu,  // 'chart' is not allowed, so 'Cpu' (implying processing/intelligence) is chosen for analytics.
};

/**
 * A reusable React component for a dashboard sidebar navigation.
 * Displays a list of navigation links with corresponding icons.
 * The currently active link is highlighted based on the current Next.js route.
 *
 * @param {DashboardSidebarNavProps} props - The props for the component.
 * @param {NavItem[]} props.items - An array of navigation items, each requiring a label, link, and an icon string.
 */
const DashboardSidebarNav: React.FC<DashboardSidebarNavProps> = ({ items }) => {
  // `usePathname` is a Next.js client-side hook, hence the "use client" directive.
  const pathname: string = usePathname();

  return (
    <nav className="flex flex-col h-full bg-gray-800 text-white w-64 p-4 shadow-lg">
      <div className="flex-grow">
        <ul>
          {items.map((item: NavItem) => {
            // Dynamically get the icon component from the map based on the item's icon string.
            const IconComponent: React.ElementType | undefined = iconMap[item.icon];
            // Determine if the current navigation item's link matches the current URL pathname.
            const isActive: boolean = pathname === item.link;

            return (
              <li key={item.label} className="mb-2">
                <Link
                  href={item.link}
                  // Apply Tailwind CSS classes for styling, including active and hover states.
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200
                    ${isActive
                      ? "bg-indigo-600 text-white shadow-md" // Active link styles
                      : "hover:bg-gray-700 text-gray-300 hover:text-white" // Inactive link styles
                    }
                  `}
                >
                  {/* Render the icon component if it was successfully mapped */}
                  {IconComponent && <IconComponent className="w-5 h-5 mr-3" aria-hidden="true" />}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default DashboardSidebarNav;