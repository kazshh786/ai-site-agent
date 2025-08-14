"use client";

import { useState } from "react";

// Define the shape of a single form field
interface FormField {
  name: string; // Unique name for the input (e.g., "fullName", "userEmail", "userMessage")
  label: string; // Displayed label for the input
  type: "text" | "email" | "password" | "tel" | "textarea"; // HTML input type
  placeholder?: string; // Optional placeholder text
  required?: boolean; // Is this field required?
}

// Define the props for the Form component
interface FormProps {
  fields: FormField[]; // An array defining all input fields for the form
  submitButtonText: string; // Text to display on the submit button
  title?: string; // Optional title for the form (e.g., "Contact Us")
  className?: string; // Optional Tailwind CSS classes for the form container
  onSubmit: (formData: Record<string, string>) => void; // Function called on form submission with form data
}

export default function Form({ fields, submitButtonText, title, className, onSubmit }: FormProps) {
  // State to hold form input values. Initialized with empty strings for all fields.
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    fields.forEach((field) => {
      initialState[field.name] = "";
    });
    return initialState;
  });

  // State for loading, error, and success messages
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle changes in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    setError(null); // Reset error message
    setSuccessMessage(null); // Reset success message
    setIsLoading(true); // Start loading

    // Simple client-side validation for required fields
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        setError(`${field.label} is required.`);
        setIsLoading(false);
        return;
      }
    }

    try {
      // Call the onSubmit prop function with the form data
      await onSubmit(formData);
      setSuccessMessage("Form submitted successfully!");
      // Optionally reset form after successful submission
      setFormData(() => {
        const resetState: Record<string, string> = {};
        fields.forEach((field) => {
          resetState[field.name] = "";
        });
        return resetState;
      });
    } catch (err: unknown) { // Use unknown for error type
      // Handle potential errors from the onSubmit function
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    // Apply provided className to the form container
    <form className={`bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-auto ${className || ""}`} onSubmit={handleSubmit}>
      {/* Conditionally render the title if provided */}
      {title && <h2 className="text-2xl font-bold text-[#233D4D] mb-6 text-center">{title}</h2>}

      {/* Map over the fields prop to render each input */}
      {fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              rows={4}
              placeholder={field.placeholder}
              required={field.required}
              // Tailwind classes for Rounded-inputs and general styling
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#F4B860] focus:border-[#F4B860] sm:text-sm text-[#233D4D]"
            ></textarea>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              // Tailwind classes for Rounded-inputs and general styling
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#F4B860] focus:border-[#F4B860] sm:text-sm text-[#233D4D]"
            />
          )}
        </div>
      ))}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        // Tailwind classes for Primary-btn/Submit-button-primary (accent color for background)
        className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#F4B860] hover:bg-[#E0A852] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4B860] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? "Submitting..." : submitButtonText}
      </button>

      {/* Error and Success messages */}
      {error && (
        <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
      )}
      {successMessage && (
        <p className="mt-4 text-sm text-green-600 text-center">{successMessage}</p>
      )}
    </form>
  );
}