"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputFieldProps {
  label: string;
  placeholder?: string;
  id: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showToggle?: boolean; // Option to show/hide password visibility toggle
  required?: boolean;
  className?: string; // For additional styling on the container div
  inputClassName?: string; // For additional styling on the input element
}

/**
 * A reusable password input field component with optional visibility toggle.
 *
 * @param {PasswordInputFieldProps} props - The props for the component.
 * @returns {JSX.Element} The rendered password input field.
 */
const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  label,
  placeholder = '••••••••',
  id,
  name,
  value,
  onChange,
  error,
  showToggle = true, // Default to true for convenience
  required = false,
  className = '',
  inputClassName = '',
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = (): void => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const inputType: string = showPassword ? 'text' : 'password';

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${showToggle ? 'pr-10' : ''}
            ${inputClassName}
          `}
        />
        {showToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-r-md"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInputField;