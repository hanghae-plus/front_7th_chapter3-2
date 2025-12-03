import {
  ChangeEventHandler,
  FocusEventHandler,
  InputHTMLAttributes,
} from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string | number;
  placeholder?: string;
  required?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  type?: string;
  className?: string;
}

export const InputField = ({
  label,
  value,
  placeholder,
  required,
  onChange,
  onBlur,
  type = "text",
  className = "",
  ...props
}: InputFieldProps) => {
  const baseInputClassName =
    "w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border";
  const inputClassName = `${baseInputClassName} ${className}`.trim();

  const inputElement = (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={inputClassName}
      required={required}
      {...props}
    />
  );

  if (label) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {inputElement}
      </div>
    );
  }

  return inputElement;
};
