"use client";

import React from 'react';

/**
 * Props for the BillingCycleToggle component.
 */
interface BillingCycleToggleProps {
  /**
   * A descriptive label for the toggle, primarily used for accessibility (aria-label).
   * Example: "Monthly/Yearly"
   */
  label: string;
  /**
   * An array of exactly two string options that the toggle will switch between.
   * This type is enforced as a tuple `[string, string]` to ensure binary options.
   * Example: ["Monthly", "Yearly"]
   */
  options: [string, string];
  /**
   * The currently selected option. This prop makes the component a controlled component.
   * It must match one of the `options` strings provided.
   */
  selectedOption: string;
  /**
   * Callback function invoked when a new option is selected by the user.
   * It receives the newly selected option string as an argument.
   * @param newOption The string value of the newly selected option.
   */
  onOptionChange: (newOption: string) => void;
}

/**
 * A reusable React component for toggling between two billing cycle options (e.g., Monthly/Yearly).
 * It uses Tailwind CSS for styling and adheres to accessibility best practices.
 */
const BillingCycleToggle: React.FC<BillingCycleToggleProps> = ({
  label,
  options,
  selectedOption,
  onOptionChange,
}) => {
  // Ensure the selectedOption is one of the valid options, otherwise default to the first one.
  const currentSelected: string = options.includes(selectedOption) ? selectedOption : options[0];

  /**
   * Handles the click event on an option button.
   * Calls the `onOptionChange` callback only if the selected option has changed.
   * @param option The string value of the option that was clicked.
   */
  const handleOptionClick = (option: string): void => {
    if (option !== currentSelected) {
      onOptionChange(option);
    }
  };

  return (
    <div
      role="radiogroup" // Indicates that this element is a group of radio buttons.
      aria-label={label} // Provides an accessible name for the radio group.
      className="inline-flex p-1 bg-gray-100 rounded-full shadow-inner max-w-sm mx-auto"
    >
      {options.map((option: string) => (
        <button
          key={option}
          role="radio" // Indicates that this element is a radio button.
          aria-checked={currentSelected === option} // Indicates whether the radio button is selected.
          onClick={() => handleOptionClick(option)}
          // Only the currently selected radio button should be in the tab order (tabIndex=0).
          // Others should be programmatically focusable (tabIndex=-1).
          tabIndex={currentSelected === option ? 0 : -1}
          className={`
            relative z-10 // Ensures the button content is above any potential background
            flex-1 px-5 py-2 text-sm font-semibold rounded-full
            transition-colors duration-300 ease-in-out // Smooth transition for color changes
            whitespace-nowrap // Prevents options from wrapping to a new line
            ${
              currentSelected === option
                ? 'bg-indigo-600 text-white shadow-md' // Active state styles
                : 'text-gray-700 hover:text-gray-900' // Inactive state styles
            }
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 // Focus styles for accessibility
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default BillingCycleToggle;