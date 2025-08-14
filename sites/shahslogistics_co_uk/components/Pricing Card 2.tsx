"use client";
import React from 'react';
import { Check } from 'lucide-react'; // ONLY use lucide-react icons: Check

/**
 * Props for the PricingCard2 component.
 * @typedef {object} PricingCard2Props
 * @property {string} planName - The name of the pricing plan (e.g., "Premium Plan").
 * @property {number} monthlyPrice - The monthly price for the plan.
 * @property {number} yearlyPrice - The yearly price for the plan.
 * @property {string[]} features - An array of features included in the plan.
 * @property {string} description - A brief description of the plan.
 * @property {string} buttonText - The text for the call-to-action button.
 * @property {boolean} isMonthly - A flag indicating whether to display the monthly or yearly price.
 * @property {boolean} [highlighted=false] - Optional. If true, the card will have highlight styling.
 */
interface PricingCard2Props {
  planName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  description: string;
  buttonText: string;
  isMonthly: boolean;
  highlighted?: boolean;
}

/**
 * Pricing Card 2 component displays a single pricing plan with its name, price, features,
 * and a call-to-action button. It supports displaying monthly or yearly prices and
 * an optional highlight style.
 *
 * This component does not require client-side interactivity like `useState`, `useEffect`, etc.
 * Therefore, the "use client" directive is not needed.
 *
 * @param {PricingCard2Props} props - The props for the component.
 * @returns {JSX.Element} The rendered Pricing Card 2 component.
 */
const PricingCard2: React.FC<PricingCard2Props> = ({
  planName,
  monthlyPrice,
  yearlyPrice,
  features,
  description,
  buttonText,
  isMonthly,
  highlighted = false, // Default to false if not provided
}) => {
  const currentPrice: number = isMonthly ? monthlyPrice : yearlyPrice;
  const periodText: string = isMonthly ? '/ month' : '/ year';

  return (
    // Outer container for the pricing card.
    // Base styles: rounded-lg, shadow-md, px-6 py-8.
    // Background and border colors dynamically chosen based on 'highlighted' prop and Shahs Logistics branding.
    <div
      className={`relative w-full max-w-sm rounded-lg p-6 shadow-md transition-all duration-300 ease-in-out hover:scale-[1.03]
        ${highlighted
          ? 'z-10 bg-[#233D4D] text-[#EFEFEF] shadow-lg outline outline-2 outline-[#F4B860]' // Highlighted: Dark background (#233D4D), light text (#EFEFEF), orange outline (#F4B860)
          : 'bg-[#EFEFEF] text-[#233D4D] outline outline-1 outline-gray-200' // Default: Light background (#EFEFEF), dark text (#233D4D), light gray outline
        }
      `}
    >
      {/* Highlight badge only for highlighted card */}
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-full bg-[#F4B860] px-4 py-1 text-xs font-semibold uppercase text-white">
          Popular
        </div>
      )}

      {/* Plan name heading. Uses Poppins font. */}
      <h3
        className={`mb-2 text-center font-['Poppins'] text-2xl font-bold
          ${highlighted ? 'text-white' : 'text-[#233D4D]'}
        `}
      >
        {planName}
      </h3>

      {/* Plan description. Uses Open Sans font, center aligned. */}
      <p
        className={`mb-6 text-center font-['Open Sans'] text-sm
          ${highlighted ? 'text-gray-300' : 'text-gray-600'}
        `}
      >
        {description}
      </p>

      <div className="mb-8 text-center">
        {/* Price text. Uses Poppins font, large size, bold. */}
        <span
          className={`font-['Poppins'] text-5xl font-bold
            ${highlighted ? 'text-white' : 'text-[#233D4D]'}
          `}
        >
          ${currentPrice}
        </span>
        {/* Price period text. Uses Open Sans font. */}
        <span
          className={`font-['Open Sans'] text-lg font-medium
            ${highlighted ? 'text-gray-300' : 'text-gray-600'}
          `}
        >
          {periodText}
        </span>
      </div>

      <ul className="mb-10 space-y-4">
        {features.map((feature: string, index: number) => (
          // Feature list item. Includes a Check icon and feature text.
          <li
            key={index}
            className={`flex items-start font-['Open Sans']
              ${highlighted ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            {/* Check icon from lucide-react with dynamic color based on highlight */}
            <Check className={`mr-2 h-5 w-5 flex-shrink-0 ${highlighted ? 'text-[#A7D7C5]' : 'text-gray-500'}`} />
            {/* Feature text. React automatically handles escaping for text nodes. */}
            {feature}
          </li>
        ))}
      </ul>

      {/* Call-to-action button. Uses Poppins font, dynamic background/border colors. */}
      <button
        type="button"
        className={`w-full rounded-md py-3 text-lg font-['Poppins'] font-semibold transition-colors duration-200 ease-in-out
          ${highlighted
            ? 'bg-[#F4B860] text-[#233D4D] hover:bg-orange-600' // Highlighted button: Orange background (#F4B860), dark text (#233D4D)
            : 'border-2 border-[#F4B860] text-[#F4B860] hover:bg-[#F4B860] hover:text-white' // Default button: Orange border, orange text, hover fill
          }
        `}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PricingCard2;