"use client";

import React from 'react';
import { Mail } from 'lucide-react'; // Using the Mail icon from the allowed list

/**
 * Props for the EmailInputField component.
 * Derived from the blueprint's "props" and common input field requirements.
 */
interface EmailInputFieldProps {
  /** The label text displayed above the input field. */
  label: string;
  /** The placeholder text displayed inside the input field when empty.
   * @default "Enter your email"
   */
  placeholder?: string;
  /** A unique identifier for the input field, used for accessibility (linked to label). */
  id: string;
  /** The name attribute for the input field, used for form submission. */
  name: string;
  /** The current value of the input field. */
  value: string;
  /** Callback function invoked when the input value changes. */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** If true, the input field will be marked as required.
   * @default false
   */
  required?: boolean;
  /** If true, the input field will be disabled.
   * @default false
   */
  disabled?: boolean;
  /** If true, the input field will display an error state (red border, text).
   * @default false
   */
  error?: boolean;
  /** The error message to display when the `error` prop is true. */
  errorMessage?: string;
  /** Additional CSS class names to apply to the outermost container div. */
  className?: string;
}

/**
 * A reusable React component for an email input field, styled with Tailwind CSS.
 * It includes a label, an email icon, and optional error display.
 *
 * @param {EmailInputFieldProps} props - The props for the component.
 * @returns {JSX.Element} The rendered email input field.
 */
const EmailInputField: React.FC<EmailInputFieldProps> = ({
  label,
  placeholder = "Enter your email",
  id,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  error = false,
  errorMessage,
  className,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="email" // Enforces email input type as per blueprint
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete="email" // Helps browsers suggest emails
          className={`
            block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6
            ${error
              ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500'
              : 'ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
          `}
          aria-invalid={error ? "true" : "false"} // ARIA attribute for accessibility
          aria-describedby={error && errorMessage ? `${id}-error` : undefined} // Link to error message for screen readers
        />
      </div>
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default EmailInputField;