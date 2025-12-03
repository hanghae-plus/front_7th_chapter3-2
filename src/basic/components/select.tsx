import { ChangeEvent, HTMLAttributes } from 'react';

interface SelectProps extends HTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Select = ({ options, value, onChange, ...props }: SelectProps) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
