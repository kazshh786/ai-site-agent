import React from 'react';
import { Truck } from 'lucide-react';

/**
 * Props for the TotalShipmentsCard component.
 */
interface TotalShipmentsCardProps {
  /**
   * The main heading or title for the card, e.g., "Total Shipments".
   */
  heading: string;
  /**
   * The primary value to display, typically a count or number, e.g., "1,234".
   * Expected as a string to accommodate various formats (e.g., "1.2K", "1,234").
   */
  value: string;
  /**
   * A descriptive text providing context for the value, e.g., "This month".
   */
  description: string;
}

/**
 * A reusable React component that displays key metric information in a card format.
 * Designed for dashboards, showing a heading, a large value, and a descriptive text.
 * It includes a relevant icon for visual enhancement.
 *
 * @param {TotalShipmentsCardProps} props - The props for the component.
 * @returns {JSX.Element} The rendered Total Shipments Card component.
 */
const TotalShipmentsCard: React.FC<TotalShipmentsCardProps> = ({ heading, value, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between h-full border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {heading}
        </h3>
        {/* Truck icon to visually represent 'shipments' */}
        <Truck className="h-7 w-7 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
      </div>
      <div className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 leading-none">
        {value}
      </div>
      <p className="text-base text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default TotalShipmentsCard;