import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  const baseClasses = "py-2 px-4 rounded-md font-medium transition-colors";
  
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;