import React from 'react';

interface FeaturesMainHeadingProps {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text: string;
}

const FeaturesMainHeading: React.FC<FeaturesMainHeadingProps> = ({ level, text }) => {
  const Tag = level as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  const baseClasses: string = 'font-extrabold text-gray-900 text-center mx-auto';

  return <Tag className={baseClasses}>{text}</Tag>;
};

export default FeaturesMainHeading;
