import { Truck, Users, Check, LucideIcon } from 'lucide-react';

/**
 * Props for the ServiceCard component.
 * @property {string} title - The main title of the service card.
 * @property {string} description - A short description of the service.
 * @property {LucideIcon} icon - The Lucide React icon component to display at the top of the card.
 */
interface ServiceCard1Props {
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * ServiceCard1 is a reusable React component designed for displaying a single service.
 * It features an icon at the top, followed by a title and a description, all centered.
 * The card has a clean, modern look with a subtle hover effect.
 *
 * This component is used on Shahs Logistics' Homepage in the "Services Showcase" section.
 *
 * @component
 * @param {ServiceCard1Props} props - The props for the component.
 * @returns {JSX.Element} The rendered ServiceCard1 component.
 */
const ServiceCard1 = ({ title, description, icon: Icon }: ServiceCard1Props): JSX.Element => {
  return (
    <div
      className="
        bg-white
        rounded-xl
        p-6
        shadow-md
        hover:shadow-lg
        transition-all
        duration-300
        text-center
        border border-gray-100
      "
    >
      {/* Icon */}
      {/* LucideIcon needs to be rendered as a component, so 'Icon' should be capitalized */}
      <Icon className="text-accent text-5xl mb-4 mx-auto" />

      {/* Title */}
      <h3 className="font-poppins font-semibold text-primary text-2xl mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="font-open-sans text-gray-600 text-base">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard1;

// Example Usage (for testing purposes, not part of the component output):
/*
import React from 'react';
import { createRoot } from 'react-dom/client';
// Assume the following are available from lucide-react and are allowed:
import { Truck, Check, Users } from 'lucide-react';

// For local demonstration, you might define a root element and render:
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <div className="p-8 bg-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins font-open-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Poppins:wght@600;700&display=swap');
          .font-poppins { font-family: 'Poppins', sans-serif; }
          .font-open-sans { font-family: 'Open Sans', sans-serif; }
          .text-primary { color: #233D4D; }
          .text-accent { color: #F4B860; }
        `}
      </style>
      <ServiceCard1
        title="Freight Forwarding"
        description="Global freight solutions by air, sea, and land for reliable and timely deliveries."
        icon={Truck}
      />
      <ServiceCard1
        title="Warehousing"
        description="Secure storage and distribution services with advanced inventory management."
        icon={Users}
      />
      <ServiceCard1
        title="Customs Clearance"
        description="Hassle-free customs processing ensures your goods move quickly and compliantly."
        icon={Check}
      />
    </div>
  );
}
*/