"use client"; // Required for using React hooks like useState

import { useState, type FC } from "react";

// Define the interface for the Toggle component's props.
// The defaultActiveOptionLabel is optional; if not provided, the first option will be active.
// The onToggle callback provides the string label of the currently selected option.
interface ToggleProps {
    option1Label: string;
    option2Label: string;
    defaultActiveOptionLabel?: string;
    onToggle: (selectedOptionLabel: string) => void;
}

/**
 * A reusable React component that renders a two-option toggle switch.
 *
 * @param {ToggleProps} props - The props for the Toggle component.
 * @param {string} props.option1Label - The text label for the first option.
 * @param {string} props.option2Label - The text label for the second option.
 * @param {string} [props.defaultActiveOptionLabel] - The label for the option that should be active by default.
 *                                                   If not provided or doesn't match, option1Label will be active.
 * @param {(selectedOptionLabel: string) => void} props.onToggle - A callback function invoked when an option is toggled,
 *                                                                passing the label of the newly active option.
 */
const Toggle: FC<ToggleProps> = ({
    option1Label,
    option2Label,
    defaultActiveOptionLabel,
    onToggle,
}) => {
    // Determine the initial active state based on defaultActiveOptionLabel.
    // If defaultActiveOptionLabel is not provided or does not match option2Label,
    // option1Label is set as the initial active option.
    const [activeOption, setActiveOption] = useState<string>(
        defaultActiveOptionLabel === option2Label ? option2Label : option1Label
    );

    // Handle clicks on the toggle options.
    // Updates the internal state and calls the onToggle callback.
    const handleOptionClick = (optionLabel: string) => {
        setActiveOption(optionLabel);
        onToggle(optionLabel);
    };

    // Determine which option is currently active for conditional styling.
    const isActive1 = activeOption === option1Label;
    const isActive2 = activeOption === option2Label;

    return (
        <div
            className="flex items-center justify-between p-1 rounded-full w-full max-w-xs mx-auto"
            // Shahs Logistics Primary Color (Dark Blue: #233D4D) as background
            style={{ backgroundColor: "#233D4D" }}
            aria-label="Toggle between two options"
            role="radiogroup" // ARIA role for a group of radio buttons
        >
            <button
                className={`flex-1 py-2 px-4 text-center text-sm rounded-full transition-all duration-300 ease-in-out font-medium
                    ${isActive1
                        ? "text-[#EFEFEF] shadow-lg" // Shahs Logistics Text Color (Off-White: #EFEFEF) for active text
                        : "bg-transparent text-[#EFEFEF] hover:bg-white/10" // Inactive background transparent, text Off-White, subtle hover
                    }`}
                // Shahs Logistics Accent Color (Orange: #F4B860) as background for active option
                style={isActive1 ? { backgroundColor: "#F4B860" } : {}}
                onClick={() => handleOptionClick(option1Label)}
                aria-pressed={isActive1} // ARIA state for a toggle button
                role="radio" // ARIA role for individual toggle option
                aria-checked={isActive1} // ARIA checked state for radio button
                tabIndex={isActive1 ? 0 : -1} // Only active button is tabbable
            >
                {option1Label}
            </button>
            <button
                className={`flex-1 py-2 px-4 text-center text-sm rounded-full transition-all duration-300 ease-in-out font-medium
                    ${isActive2
                        ? "text-[#EFEFEF] shadow-lg" // Shahs Logistics Text Color (Off-White: #EFEFEF) for active text
                        : "bg-transparent text-[#EFEFEF] hover:bg-white/10" // Inactive background transparent, text Off-White, subtle hover
                    }`}
                // Shahs Logistics Accent Color (Orange: #F4B860) as background for active option
                style={isActive2 ? { backgroundColor: "#F4B860" } : {}}
                onClick={() => handleOptionClick(option2Label)}
                aria-pressed={isActive2} // ARIA state for a toggle button
                role="radio" // ARIA role for individual toggle option
                aria-checked={isActive2} // ARIA checked state for radio button
                tabIndex={isActive2 ? 0 : -1} // Only active button is tabbable
            >
                {option2Label}
            </button>
        </div>
    );
};

export default Toggle;