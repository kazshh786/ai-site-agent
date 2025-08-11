interface FeaturesSubtitleProps {
  text: string;
}

const FeaturesSubtitle: React.FC<FeaturesSubtitleProps> = ({ text }) => {
  return (
    <p className="text-lg text-gray-700 max-w-prose leading-relaxed">
      {text}
    </p>
  );
};

export default FeaturesSubtitle;