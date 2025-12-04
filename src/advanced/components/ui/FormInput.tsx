interface FormInputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  className = "",
}: FormInputProps) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
      />
    </div>
  );
};
