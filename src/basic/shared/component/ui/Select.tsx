import React from 'react';

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  className?: string;
  children: React.ReactNode;
}

export const Select = ({ className = '', children, ...props }: SelectProps) => {
  return (
    <select
      className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};
