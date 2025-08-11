interface PricingSubtitleProps {
  /**
   * The text content for the pricing subtitle.
   */
  text: string;
}

/**
 * Renders a subtitle for the pricing section, typically providing
 * a brief explanation or context for the pricing plans.
 */
const PricingSubtitle: React.FC<PricingSubtitleProps> = ({ text }) => {
  return (
    <p className="text-base sm:text-lg text-gray-600 text-center mx-auto max-w-2xl px-4">
      {text}
    </p>
  );
};

export default PricingSubtitle;