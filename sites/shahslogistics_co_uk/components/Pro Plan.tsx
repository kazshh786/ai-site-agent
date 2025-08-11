import Link from 'next/link';
import { Check } from 'lucide-react'; // Only allowed icon from the list

/**
 * Props for the ProPlan component, derived from the blueprint's "PricingCard" type
 * and specifically the "Pro Plan" instance's properties.
 * A `buttonHref` prop is added as all interactive buttons in Next.js applications
 * typically require a navigation target, and the instructions require using `<Link>`.
 */
interface ProPlanProps {
  planName: string;
  price: string;
  features: string[];
  buttonText: string;
  buttonHref: string; // Added to facilitate Next.js <Link> component
}

/**
 * Renders a pricing card component, specifically tailored for the "Pro Plan"
 * as described in the website blueprint. It showcases a plan's name, price,
 * a list of features, and a call-to-action button.
 */
const ProPlan: React.FC<ProPlanProps> = ({
  planName,
  price,
  features,
  buttonText,
  buttonHref,
}) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-200">
      {/* Plan Name */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
        {planName}
      </h3>

      {/* Price */}
      <div className="flex items-baseline justify-center mb-6">
        <span className="text-5xl font-extrabold text-indigo-600">
          {price}
        </span>
        {/*
          The blueprint only provides price values like "$199" or "Contact Us".
          If a "/month" suffix is desired, it should be passed as a prop
          or decided by the consuming component. Sticking strictly to blueprint props here.
        */}
      </div>

      {/* Features List */}
      <ul className="space-y-4 flex-grow mb-8">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center">
            {/* Checkmark Icon */}
            <Check className="flex-shrink-0 w-6 h-6 text-green-500 mr-3" />
            <span className="text-gray-700 text-lg">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Call-to-action Button */}
      <Link
        href={buttonHref}
        className="mt-auto block w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 text-white font-medium rounded-lg text-center px-5 py-3 text-lg transition-colors duration-200"
        aria-label={`Choose ${planName} plan`}
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default ProPlan;