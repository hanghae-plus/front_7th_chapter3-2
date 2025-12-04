interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  variant = "primary",
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-md text-sm font-medium transition-colors";

  const variantStyles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
