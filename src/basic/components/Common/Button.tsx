import { type FC, type ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "icon" | "close"; // close 추가
  size?: "sm" | "md" | "lg";
}

const Button: FC<IProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  children,
  ...props
}) => {
  const baseClass = "rounded font-medium transition-colors";

  const variantClass = disabled
    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
    : {
        primary: "bg-yellow-400 text-gray-900 hover:bg-yellow-500",
        secondary: "bg-gray-900 text-white hover:bg-gray-800",
        icon: "border border-gray-300 hover:bg-gray-100",
        close: "text-gray-400 hover:text-red-500",
      }[variant];

  const sizeClass = {
    sm: "w-4 h-4 text-xs",
    md: "py-2 px-4",
    lg: "py-3 px-6",
  }[size];

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
