import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

interface PricingCard1Props {
  name: string;
  description: string;
  price: string;
  pricePeriod: string; // e.g., "/month"
  features: string[];
  buttonText: string;
  buttonHref: string;
  isHighlighted?: boolean; // Optional: If true, applies a distinct style (though this component is 'Card-secondary')
}

/**
 * A reusable pricing card component for Shahs Logistics, styled with Tailwind CSS.
 * This component displays a plan's name, description, price, period, a list of features,
 * and a call-to-action button.
 *
 * @param {PricingCard1Props} props - The properties for the PricingCard1 component.
 * @param {string} props.name - The name of the pricing plan (e.g., "Basic Plan").
 * @param {string} props.description - A brief description of the plan.
 * @param {string} props.price - The price of the plan (e.g., "$10").
 * @param {string} props.pricePeriod - The pricing period (e.g., "/month", "/year").
 * @param {string[]} props.features - An array of strings, each representing a feature included in the plan.
 * @param {string} props.buttonText - The text displayed on the call-to-action button.
 * @param {string} props.buttonHref - The URL the button navigates to.
 * @param {boolean} [props.isHighlighted] - Optional flag to apply a highlight style. For "Pricing Card 1" (Basic Plan), this should be false.
 */
const PricingCard1: React.FC<PricingCard1Props> = ({
  name,
  description,
  price,
  pricePeriod,
  features,
  buttonText,
  buttonHref,
  isHighlighted = false, // Default to false for "Pricing Card 1"
}) => {
  // Client branding colors
  const brandingPrimaryColor: string = "#233D4D"; // Dark blue (Used for text and borders)
  const brandingSecondaryColor: string = "#A7D7C5"; // Light green (Used for card background)
  const brandingAccentColor: string = "#F4B860"; // Orange (Used for button background)
  const brandingTextColor: string = "#EFEFEF"; // Light white (Used for button text)

  return (
    <div
      className={`relative flex flex-col items-center justify-between
        rounded-xl px-6 py-8 shadow-md transition-transform duration-300
        hover:scale-105
        ${isHighlighted ? `bg-${brandingAccentColor} text-white` : `bg-[${brandingSecondaryColor}] text-[${brandingPrimaryColor}]`}
        font-['Open_Sans']
      `}
      style={{
        backgroundColor: isHighlighted ? brandingAccentColor : brandingSecondaryColor,
        color: isHighlighted ? brandingTextColor : brandingPrimaryColor,
      }}
    >
      {/* Plan Name */}
      <h3
        className="mb-3 text-3xl font-bold font-['Poppins']"
        style={{ color: isHighlighted ? brandingPrimaryColor : brandingPrimaryColor }}
      >
        {name}
      </h3>

      {/* Plan Description */}
      <p
        className="mb-6 max-w-[250px] text-base leading-snug"
        style={{ color: isHighlighted ? brandingPrimaryColor : brandingPrimaryColor }}
      >
        {description}
      </p>

      {/* Price */}
      <div
        className="flex items-end justify-center gap-1 mb-8"
        style={{ color: isHighlighted ? brandingPrimaryColor : brandingPrimaryColor }}
      >
        <span className="text-5xl font-extrabold font-['Poppins']">{price}</span>
        <span className="text-xl font-medium font-['Open_Sans']">{pricePeriod}</span>
      </div>

      {/* Features List */}
      <ul className="mb-10 w-full flex-grow list-none p-0 space-y-4 text-center">
        {features.map((feature: string, index: number) => (
          <li
            key={index}
            className="flex items-center gap-3 text-lg"
            style={{ color: isHighlighted ? brandingPrimaryColor : brandingPrimaryColor }}
          >
            <Check className={`h-6 w-6 shrink-0`} style={{ color: isHighlighted ? brandingPrimaryColor : brandingPrimaryColor }} /> {/* Icon color adjusted */}
            {feature}
          </li>
        ))}
      </ul>

      {/* Call to Action Button */}
      <Link
        href={buttonHref}
        className={`inline-flex items-center justify-center
          rounded-full px-8 py-3 text-lg font-semibold font-['Poppins']
          transition-colors duration-200 ease-in-out hover:opacity-90
        `}
        style={{
          backgroundColor: brandingAccentColor, // Orange background
          color: brandingTextColor, // Light white text
        }}
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default PricingCard1;