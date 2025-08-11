import React from 'react';

/**
 * Props for the CopyrightInfo component.
 */
interface CopyrightInfoProps {
  /**
   * The copyright text to be displayed.
   * Example: "© 2024 Shahs Logistics. All rights reserved."
   */
  text: string;
}

/**
 * A reusable React component to display copyright information.
 * It's typically used in the footer of a website.
 */
const CopyrightInfo: React.FC<CopyrightInfoProps> = ({ text }) => {
  return (
    <p className="text-sm text-gray-500 text-center px-4 py-2">
      {text}
    </p>
  );
};

export default CopyrightInfo;