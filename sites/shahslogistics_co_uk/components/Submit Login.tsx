interface SubmitLoginProps {
  /** The text displayed on the button. */
  text: string;
  /** The visual style variant of the button. */
  variant: "primary" | "secondary" | "outline";
  /** The size of the button. */
  size: "small" | "medium" | "large";
  /** If true, the button will take up the full width of its parent container. */
  fullWidth?: boolean;
  /** Optional click handler for the button. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** The HTML type attribute of the button (e.g., "submit", "button", "reset"). Defaults to "submit". */
  type?: "button" | "submit" | "reset";
  /** If true, the button will be disabled. */
  disabled?: boolean;
  /** Additional CSS class names to apply to the button for custom styling. */
  className?: string;
}

const SubmitLogin: React.FC<SubmitLoginProps> = ({
  text,
  variant,
  size,
  fullWidth = false,
  onClick,
  type = "submit", // Default to 'submit' as it's a login submit button
  disabled = false,
  className,
}) => {
  const baseClasses =
    "font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses: Record<SubmitLoginProps["variant"], string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
  };

  const sizeClasses: Record<SubmitLoginProps["size"], string> = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const fullWidthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidthClass,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {text}
    </button>
  );
};

export default SubmitLogin;