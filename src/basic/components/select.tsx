import { ChangeEvent, HTMLAttributes } from 'react';

interface SelectProps extends HTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'shadow';
  options: { label: string; value: string }[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const variants = {
  default: 'w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500',
  shadow: 'w-full text-sm border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
};

const Select = ({ variant = 'default', options, value, onChange, className = '', ...props }: SelectProps) => {
  return (
    <select value={value} onChange={onChange} className={`${variants[variant]} ${className}`} {...props}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
