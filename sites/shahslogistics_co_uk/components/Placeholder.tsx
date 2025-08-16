import React from 'react';

/**
 * Props for the Placeholder component.
 */
interface PlaceholderProps {
  /**
   * The name of the component that failed to load.
   */
  componentName: string;
}

/**
 * A fallback component to display when another component fails to load.
 * It shows a friendly message with a warning theme using Tailwind CSS.
 *
 * @param {PlaceholderProps} props - The properties for the component.
 * @param {string} props.componentName - The name of the component that failed to load.
 * @returns {JSX.Element} A React component displaying a placeholder message.
 */
export default function Placeholder({ componentName }: PlaceholderProps): JSX.Element {
  return (
    <div
      className="
        bg-yellow-100
        border
        border-yellow-400
        text-yellow-800
        p-4
        rounded-md
        flex
        items-center
        justify-center
        text-center
        min-h-[120px]
      "
      role="status" // Indicating a status message rather than an immediate alert
      aria-live="polite" // Announce changes politely
      aria-label={`Component ${componentName} failed to load`}
    >
      <p className="font-semibold text-lg">
        Uh oh! We couldn&apos;t load the <span className="font-bold text-yellow-900">&quot;{componentName}&quot;</span> component.
        <br />
        Please check your connection or try again later.
      </p>
    </div>
  );
}