import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

// Define the interface for the component's props based on the blueprint
interface EnterprisePlanProps {
  planName: string; // e.g., "Enterprise"
  price: string; // e.g., "Contact Us"
  features: string[]; // e.g., ["Unlimited Users", "Priority Support"]
  buttonText: string; // e.g., "Contact Sales"
  buttonLink?: string; // Optional, default to /contact for enterprise plans
}

/**
 * Enterprise Plan Component
 *
 * A reusable React component for displaying an Enterprise pricing plan card.
 * It features a plan name, price, a list of features with checkmarks,
 * and a call-to-action button linking to a specified URL.
 */
const EnterprisePlan: React.FC<EnterprisePlanProps> = ({
  planName,
  price,
  features,
  buttonText,
  buttonLink = '/contact', // Default link for enterprise plans is the contact page
}) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl border border-indigo-200 flex flex-col items-center text-center max-w-sm mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <h3 className="text-3xl font-bold text-indigo-700 mb-4">
        {planName}
      </h3>
      <p className="text-5xl font-extrabold text-indigo-600 mb-6">
        {price}
      </p>
      <ul className="text-left w-full space-y-3 mb-8">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center text-gray-700">
            <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-lg">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href={buttonLink} passHref legacyBehavior>
        <a className="w-full py-3 px-6 rounded-md font-semibold text-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
          {buttonText}
        </a>
      </Link>
    </div>
  );
};

export default EnterprisePlan;