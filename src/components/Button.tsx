
import React from 'react';
import { STRIPE_PLACEHOLDER_URL } from '../constants';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
  onClick?: () => void;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  href 
}) => {
  const baseStyles = "px-8 py-4 rounded-full font-semibold transition-all duration-300 transform active:scale-95 text-center inline-block";
  
  const variants = {
    primary: "bg-viridian text-white hover:bg-viridian-dark shadow-lg shadow-viridian/20",
    outline: "border-2 border-viridian text-viridian hover:bg-viridian hover:text-white",
    ghost: "text-viridian hover:bg-[#F1F7F5]"
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClassName} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  );
};

export default Button;
