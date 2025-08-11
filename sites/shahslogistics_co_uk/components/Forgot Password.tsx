"use client";

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

/**
 * Props for the ForgotPassword component.
 */
interface ForgotPasswordProps {
  /**
   * A callback function triggered when the forgot password form is submitted.
   * It receives the email address entered by the user.
   * This function can be asynchronous (return a Promise) or synchronous.
   */
  onForgotPasswordSubmit: (email: string) => Promise<void> | void;
  /**
   * Optional: Indicates if the form submission is currently in progress.
   * When true, the input and button will be disabled, and the button text will change.
   * Defaults to `false`.
   */
  isLoading?: boolean;
  /**
   * Optional: Indicates if the forgot password request was successfully processed.
   * When true, a success message will be displayed, and the form will be hidden.
   * Defaults to `false`.
   */
  isSuccess?: boolean;
  /**
   * Optional: A message to display if an error occurs during the submission.
   * This message will be shown in a red alert box.
   */
  errorMessage?: string;
  /**
   * Optional: A message to display upon successful submission.
   * This message will be shown in a green alert box.
   */
  successMessage?: string;
  /**
   * Optional: A callback function to execute when the "Back to login" link is clicked.
   * If provided, this link will be visible. This allows the parent component
   * to handle navigation back to the login page.
   */
  onBackToLogin?: () => void;
}

/**
 * A reusable React component for the "Forgot Password" functionality.
 * It provides a form for users to enter their email address to receive a password reset link.
 *
 * @param {ForgotPasswordProps} props - The props for the component.
 */
const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onForgotPasswordSubmit,
  isLoading = false,
  isSuccess = false,
  errorMessage,
  successMessage,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState<string>('');

  /**
   * Handles the form submission event.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (email.trim() === '') {
      // Basic client-side validation to ensure email is not empty
      return;
    }
    await onForgotPasswordSubmit(email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans antialiased">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg md:p-10">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Forgot Your Password?
        </h2>
        <p className="mb-8 text-center text-base text-gray-600">
          Don&apos;t worry! Enter your email and we&apos;ll send you a reset link.
        </p>

        {isSuccess && successMessage && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700 ring-1 ring-green-600/20" role="alert">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-600/20" role="alert">
            {errorMessage}
          </div>
        )}

        {!isSuccess && ( // Only show the form if not successful yet
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  disabled={isLoading}
                  aria-describedby={errorMessage ? 'email-error' : undefined}
                  aria-invalid={!!errorMessage}
                />
                {errorMessage && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {onBackToLogin && (
          <div className="mt-8 text-center">
            <button
              type="button" // Use type="button" to prevent accidental form submission if placed inside a form
              onClick={onBackToLogin}
              className="inline-flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <ArrowRight className="mr-1 h-4 w-4 rotate-180" aria-hidden="true" /> {/* Rotate for back arrow effect */}
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;