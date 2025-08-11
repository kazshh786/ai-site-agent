import Link from 'next/link';
import { Check } from 'lucide-react';

interface BasicPlanProps {
  /**
   * The name of the pricing plan (e.g., "Basic", "Pro", "Enterprise").
   */
  planName: string;
  /**
   * The price string for the plan (e.g., "$99", "Contact Us").
   */
  price: string;
  /**
   * An array of features included in the plan.
   */
  features: string[];
  /**
   * The text displayed on the call-to-action button.
   */
  buttonText: string;
  /**
   * The URL for the call-to-action button.
   */
  buttonLink: string;
  /**
   * Optional: If true, the plan card will be visually highlighted (e.g., for a "Popular" plan).
   * Defaults to false.
   */
  isHighlighted?: boolean;
}

/**
 * A reusable React component for displaying a pricing plan card.
 * Designed to be adaptable for different plan types (Basic, Pro, Enterprise, etc.).
 */
const BasicPlan: React.FC<BasicPlanProps> = ({
  planName,
  price,
  features,
  buttonText,
  buttonLink,
  isHighlighted = false,
}) => {
  const cardClasses: string = `
    flex flex-col
    bg-white
    rounded-xl
    shadow-md
    p-6 sm:p-8
    border-2
    ${isHighlighted ? 'border-blue-600 shadow-xl scale-[1.02] transform' : 'border-gray-200'}
    transition-all duration-300
    hover:shadow-xl hover:scale-[1.01]
  `;

  const buttonClasses: string = `
    mt-auto
    block
    w-full
    text-center
    py-3
    px-6
    rounded-lg
    text-lg
    font-semibold
    transition-colors duration-300
    whitespace-nowrap
    ${isHighlighted
      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
      : 'bg-gray-100 text-blue-600 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300'}
  `;

  return (
    <div className={cardClasses}>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
        {planName}
      </h3>
      <div className="text-5xl font-extrabold text-blue-600 mb-6 text-center">
        {price}
        {/* Only show "/month" if the price is numerical and not for "Enterprise" type plans */}
        {planName !== 'Enterprise' && price.startsWith('$') && (
          <span className="text-lg font-medium text-gray-500">/month</span>
        )}
      </div>

      <ul className="flex-grow space-y-3 mb-8 text-gray-700 text-base">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={buttonLink} className={buttonClasses}>
        {buttonText}
      </Link>
    </div>
  );
};

export default BasicPlan;