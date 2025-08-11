import React from 'react';
import { Truck } from 'lucide-react'; // Chosen as the best available icon for "route"

/**
 * Props for the RouteOptimization component, inferred from the blueprint.
 * This component functions as a specific type of FeatureCard.
 */
interface RouteOptimizationProps {
  heading: string;
  description: string;
  icon: 'route'; // As specified in the blueprint, although we map it to a visual icon
}

/**
 * RouteOptimization Component
 *
 * A reusable React component designed as a feature card for the "Route Optimization" service.
 * It displays a clear heading, a descriptive text, and a relevant icon to represent the feature.
 *
 * Styling is handled using Tailwind CSS for a modern and professional appearance.
 *
 * @param {RouteOptimizationProps} props - The props for the component.
 * @param {string} props.heading - The main heading for the feature card.
 * @param {string} props.description - A brief description of the feature.
 * @param {'route'} props.icon - The specific icon identifier (mapped to a Truck icon visually).
 */
const RouteOptimization: React.FC<RouteOptimizationProps> = ({ heading, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
        {/* Using the Truck icon as the best visual representation for 'route' from the allowed icons */}
        <Truck size={32} strokeWidth={2} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{heading}</h3>
      <p className="text-base text-gray-600">{description}</p>
    </div>
  );
};

export default RouteOptimization;