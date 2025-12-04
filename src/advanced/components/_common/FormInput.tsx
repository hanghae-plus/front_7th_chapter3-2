import type { InputHTMLAttributes, FC } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value?: string | number;
  onValueChange: (value: string) => void;
}

const FormInput: FC<IProps> = ({
  label,
  value,
  onValueChange,
  required = false,
  placeholder,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default FormInput;
