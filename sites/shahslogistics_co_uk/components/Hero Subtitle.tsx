interface HeroSubtitleProps {
  /**
   * The text content for the hero subtitle.
   */
  text: string;
}

/**
 * A reusable React component for displaying a subtitle in a hero section.
 * It's designed to provide additional context or a brief description
 * accompanying a main hero heading.
 */
const HeroSubtitle: React.FC<HeroSubtitleProps> = ({ text }) => {
  return (
    <p
      className="
        text-lg 
        sm:text-xl 
        md:text-2xl 
        text-gray-300 
        text-center 
        max-w-3xl 
        mx-auto 
        leading-relaxed 
        mt-4 
        mb-8
      "
    >
      {text}
    </p>
  );
};

export default HeroSubtitle;