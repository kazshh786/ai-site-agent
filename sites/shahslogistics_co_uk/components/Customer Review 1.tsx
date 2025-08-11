import React from 'react';
import { Star } from 'lucide-react';

interface CustomerReview1Props {
  quote: string;
  author: string;
  role: string;
}

const CustomerReview1: React.FC<CustomerReview1Props> = ({ quote, author, role }) => {
  return (
    <div className="flex flex-col bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
      {/* Optional: Stars for rating aesthetic, though not explicitly in blueprint props */}
      <div className="flex text-yellow-500 mb-4">
        <Star size={20} fill="currentColor" className="mr-1" />
        <Star size={20} fill="currentColor" className="mr-1" />
        <Star size={20} fill="currentColor" className="mr-1" />
        <Star size={20} fill="currentColor" className="mr-1" />
        <Star size={20} fill="currentColor" />
      </div>

      <p className="text-lg italic text-gray-700 leading-relaxed flex-grow">
        &quot;{quote.replace(/'/g, '&apos;')}&quot;
      </p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
};

export default CustomerReview1;