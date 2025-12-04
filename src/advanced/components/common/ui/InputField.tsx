import {
  ChangeEventHandler,
  FocusEventHandler,
  InputHTMLAttributes,
} from "react";

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur'> {
  label?: string;
  value?: string | number | boolean;
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
  const isCheckbox = type === "checkbox";
  
  const baseInputClassName = isCheckbox
    ? "w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
    : "w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border";
  const inputClassName = `${baseInputClassName} ${className}`.trim();

  const inputElement = (
    <input
      type={type}
      value={isCheckbox ? undefined : (value as string | number | undefined)}
      checked={isCheckbox ? (value as boolean | undefined) : undefined}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={inputClassName}
      required={required}
      {...props}
    />
  );

  if (label) {
    if (isCheckbox) {
      return (
        <div className="flex items-center gap-2">
          {inputElement}
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            {label}
          </label>
        </div>
      );
    }
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
