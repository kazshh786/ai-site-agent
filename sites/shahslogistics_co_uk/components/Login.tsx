"use client"; // Required for useState and form interactivity

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

// Define the props interface for the Login component
interface LoginProps {
  // Logo Props
  logoSrc?: string;
  logoAlt?: string;

  // Heading Props
  headingText?: string;

  // Email Input Props
  emailLabel?: string;
  emailPlaceholder?: string;

  // Password Input Props
  passwordLabel?: string;
  passwordPlaceholder?: string;

  // Login Button Props
  loginButtonText?: string;

  // Forgot Password Link Props
  forgotPasswordText?: string;
  forgotPasswordLink?: string;

  // Sign Up Link Props
  signUpText?: string; // Example: "Don't have an account? Sign Up"
  signUpLink?: string;

  // Callback for login submission
  onLogin: (email: string, password: string) => Promise<void> | void;
}

const Login: React.FC<LoginProps> = ({
  logoSrc = "/assets/logo.png",
  logoAlt = "Shahs Logistics Logo",
  headingText = "Welcome Back!",
  emailLabel = "Email Address",
  emailPlaceholder = "Enter your email",
  passwordLabel = "Password",
  passwordPlaceholder = "••••••••",
  loginButtonText = "Login",
  forgotPasswordText = "Forgot Password?",
  forgotPasswordLink = "/forgot-password",
  signUpText = "Don't have an account? Sign Up",
  signUpLink = "/signup",
  onLogin,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null); // Clear previous errors
    setIsSubmitting(true);

    try {
      await onLogin(email, password);
      // Logic for successful login (e.g., redirect) would be handled by the parent component
    } catch (err: unknown) {
      // Type guard for unknown error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        // Fallback for non-Error type rejections
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Split signUpText into a prefix part and a link part for rendering.
  // This handles phrases like "Don't have an account? Sign Up" where only "Sign Up" is the link.
  const signUpParts: [string, string] = ["", signUpText]; // Default: assume whole text is for link
  const questionMarkIndex = signUpText.indexOf('?');
  if (questionMarkIndex !== -1) {
    signUpParts[0] = signUpText.substring(0, questionMarkIndex + 1).trim();
    signUpParts[1] = signUpText.substring(questionMarkIndex + 1).trim();
  } else if (signUpText.includes(' ')) { // If no '?' but spaces, try splitting by the last space
    const lastSpaceIndex = signUpText.lastIndexOf(' ');
    signUpParts[0] = signUpText.substring(0, lastSpaceIndex).trim();
    signUpParts[1] = signUpText.substring(lastSpaceIndex + 1).trim();
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center">
          {/* Logo */}
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={180} // Example width, adjust as needed for optimal display
            height={48} // Example height, adjust as needed
            className="mb-6 object-contain"
            priority // Prioritize loading for Largest Contentful Paint
          />
          {/* Heading */}
          <h2 className="text-center text-3xl font-bold text-gray-800">
            {headingText}
          </h2>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input Field */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              {emailLabel}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder={emailPlaceholder}
              required
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              autoComplete="email"
            />
          </div>

          {/* Password Input Field */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              {passwordLabel}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder={passwordPlaceholder}
              required
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              autoComplete="current-password"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end text-sm">
            <Link
              href={forgotPasswordLink}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {forgotPasswordText}
            </Link>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Logging In..." : loginButtonText}
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          {signUpParts[0] && (
            // Use dangerouslySetInnerHTML to correctly escape apostrophes from default/prop strings
            <span dangerouslySetInnerHTML={{ __html: signUpParts[0].replace(/'/g, '&apos;') + ' ' }} />
          )}
          <Link href={signUpLink} className="font-medium text-indigo-600 hover:text-indigo-500">
            {signUpParts[1]}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;