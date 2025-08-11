import React from 'react';

interface PlaceholderProps {
  componentName: string;
}

export default function Placeholder({ componentName }: PlaceholderProps) {
  return (
    <div
      className="
        p-4
        rounded-md
        bg-yellow-100       /* Light yellow background */
        border              /* Add a border */
        border-yellow-400   /* Yellow border */
        text-yellow-800     /* Dark yellow text */
        flex                /* Use flexbox for alignment */
        items-center        /* Vertically align items */
        space-x-2           /* Space between icon and text */
        font-sans           /* Ensure a readable font */
      "
      role="alert"
    >
      <svg
        className="w-5 h-5 text-yellow-500 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.513 2.679-1.513 3.444 0l8.757 17.499A1.5 1.5 0 0118.257 22H1.743a1.5 1.5 0 01-1.342-2.248L8.257 3.099zM10 8a1 1 0 011 1v4a1 1 0 11-2 0V9a1 1 0 011-1zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        ></path>
      </svg>
      <p className="font-medium text-sm sm:text-base">
        Placeholder: Failed to load component "{componentName}". Please check your configuration.
      </p>
    </div>
  );
}