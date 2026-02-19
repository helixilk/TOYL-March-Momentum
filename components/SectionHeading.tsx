
import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, centered = true }) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
      <h2 className="text-4xl md:text-5xl font-serif text-[#004B3E] mb-4">{title}</h2>
      {subtitle && <p className="text-lg text-[#576574] max-w-2xl mx-auto">{subtitle}</p>}
      <div className={`h-1 w-20 bg-[#007F5F] mt-6 ${centered ? 'mx-auto' : ''}`}></div>
    </div>
  );
};

export default SectionHeading;
