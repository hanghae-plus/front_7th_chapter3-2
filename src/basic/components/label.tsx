import { HTMLAttributes, ReactNode } from 'react';

interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

const Label = ({ className = '', children, ...props }: LabelProps) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props}>
      {children}
    </label>
  );
};

export default Label;
