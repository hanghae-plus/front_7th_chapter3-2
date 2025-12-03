import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: keyof typeof sizes;
  variant: keyof typeof variants;
}

const sizes = {
  xs: 'px-3 py-1.5 rounded text-sm',
  sm: 'px-4 py-2 rounded-md text-sm',
  md: 'px-4 py-2 rounded-md text-sm font-medium',
  lg: 'px-4 py-2 rounded-md text-md font-medium',
  xl: 'py-3 rounded-md text-md font-medium'
};

const variants = {
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  dark: 'bg-gray-900 text-white hover:bg-gray-800',
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  accent: 'bg-yellow-400 text-gray-900 hover:bg-yellow-500',
  text: 'text-gray-600 hover:text-gray-900',
  subtle: 'text-indigo-600 hover:text-indigo-900',
  destructive: 'text-red-600 hover:text-red-900',
  delete: 'text-gray-400 hover:text-red-600'
};

const Button = ({ size, variant, className = '', disabled, children, ...props }: ButtonProps) => {
  return (
    <button
      className={`
        transition-colors
        ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : variants[variant]}
        ${size ? sizes[size] : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
