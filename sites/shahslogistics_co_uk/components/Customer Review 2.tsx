import React from 'react';
import { Star } from 'lucide-react'; // Only allowed icons from lucide-react

// Define the interface for the component's props based on the blueprint
interface CustomerReview2Props {
  quote: string;
  author: string;
  role: string;
}

/**
 * A reusable React component to display a customer review or testimonial as a quote card.
 * It features the review text, the author's name, and their role, with a visual star rating.
 */
const CustomerReview2: React.FC<CustomerReview2Props> = ({ quote, author, role }) => {
  return (
    <div className="flex flex-col bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      {/* Star Rating - static for visual appeal as no rating prop is provided */}
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-5 h-5 text-yellow-500 fill-current mr-0.5"
            aria-hidden="true" // Decorative icon, hide from screen readers
          />
        ))}
      </div>

      {/* The customer's quote/testimonial */}
      <p className="text-gray-700 text-lg italic mb-4 leading-relaxed flex-grow">
        &quot;{quote}&quot;
      </p>

      {/* Author and Role */}
      <div className="text-right pt-2 border-t border-gray-100">
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
};

export default CustomerReview2;