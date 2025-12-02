import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: keyof typeof variants;
}

const variants = {
  search: 'px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500',
  text: 'border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2',
  number: 'px-2 py-1 rounded'
};

const Input = ({ type, className, ...props }: InputProps) => {
  return <input type={type} className={`w-full border ${variants[type]} ${className}`} {...props} />;
};

export default Input;
