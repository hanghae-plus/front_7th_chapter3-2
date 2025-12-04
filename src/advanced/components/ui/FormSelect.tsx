interface FormSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export const FormSelect = ({
  label,
  value,
  onChange,
  children,
  className = "",
}: FormSelectProps) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
      >
        {children}
      </select>
    </div>
  );
};
