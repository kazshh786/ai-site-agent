import Link from 'next/link';
import { Check } from 'lucide-react';

/**
 * @interface PricingCard3Props
 * @description Props for the PricingCard3 component.
 * @property {string} name - The name of the pricing plan (e.g., "Enterprise Plan").
 * @property {string} price - The price of the plan, including currency and period (e.g., "$999/month" or "Custom pricing").
 * @property {string} description - A brief description or tagline for the plan.
 * @property {string[]} features - An array of strings, each representing a feature of the plan.
 * @property {string} buttonText - The text for the call-to-action button.
 * @property {string} buttonHref - The URL the button navigates to.
 * @property {boolean} [isHighlighted=false] - Optional. If true, applies specific styling to highlight the card.
 * @property {string} [className] - Optional. Additional Tailwind CSS classes to apply to the top-level container for custom styling.
 */
interface PricingCard3Props {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  isHighlighted?: boolean;
  className?: string;
}

/**
 * @component PricingCard3
 * @description A reusable React component for displaying a pricing plan card, styled according to Shahs Logistics' branding and a "Card-secondary" style.
 * @param {PricingCard3Props} props - The properties for the component.
 * @returns {JSX.Element} A React component.
 */
const PricingCard3: React.FC<PricingCard3Props> = ({
  name,
  price,
  description,
  features,
  buttonText,
  buttonHref,
  isHighlighted = false,
  className,
}) => {
  // Base styling for all cards (Card-secondary)
  const baseCardStyles: string = `
    flex flex-col
    bg-white
    border border-gray-200
    rounded-xl
    shadow-lg
    overflow-hidden
    p-6 sm:p-8
    transition-transform duration-300 ease-in-out
    transform hover:scale-[1.02]
  `;

  // Conditional highlight styling
  const highlightStyles: string = isHighlighted
    ? `
      border-[#F4B860] ring-2 ring-[#F4B860]
      shadow-xl
    `
    : '';

  return (
    <div className={`${baseCardStyles} ${highlightStyles} ${className || ''}`}>
      {/* Plan Header: Name, Price, Description */}
      <div className="text-center mb-8">
        {/* Plan Name */}
        <h3 className="font-poppins text-xl sm:text-2xl font-bold text-[#233D4D] mb-2 leading-tight">
          {name}
        </h3>
        {/* Price */}
        <p className="font-poppins text-4xl sm:text-5xl font-extrabold text-[#233D4D] leading-none mb-2">
          {price}
        </p>
        {/* Description */}
        <p className="font-open-sans text-gray-600">
          {description}
        </p>
      </div>

      {/* Features List */}
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start text-left">
            {/* Check icon */}
            <Check className="h-5 w-5 text-[#A7D7C5] mr-2 flex-shrink-0" />
            <span className="font-open-sans text-gray-700">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <div className="w-full">
        <Link href={buttonHref} passHref legacyBehavior>
          <a
            className="
              block
              w-full
              text-center
              bg-[#F4B860]
              text-[#233D4D]
              font-poppins
              font-semibold
              py-3 px-6
              rounded-md
              shadow-md
              hover:bg-opacity-90
              hover:shadow-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#F4B860] focus:ring-opacity-50
            "
            aria-label={`Get started with the ${name} plan`}
          >
            {buttonText}
          </a>
        </Link>
      </div>
    </div>
  );
};

export default PricingCard3;