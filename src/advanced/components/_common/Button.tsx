import { type FC, type ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost";
  color?: "primary" | "secondary" | "danger" | "indigo" | "gray";
  size?: "sm" | "md" | "lg";
}

const Button: FC<IProps> = ({
  variant = "solid",
  color = "primary",
  size = "md",
  className = "",
  disabled = false,
  children,
  ...props
}) => {
  const baseClass =
    "rounded font-medium transition-colors flex items-center justify-center";

  const colorClass = {
    primary: {
      solid: "bg-yellow-400 text-gray-900 hover:bg-yellow-500",
      outline: "border border-yellow-400 text-yellow-600 hover:bg-yellow-50",
      ghost: "text-yellow-600 hover:bg-yellow-50",
    },
    secondary: {
      solid: "bg-gray-900 text-white hover:bg-gray-800",
      outline: "border border-gray-900 text-gray-900 hover:bg-gray-50",
      ghost: "text-gray-900 hover:bg-gray-100",
    },
    gray: {
      solid: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    },
    danger: {
      solid: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-red-600 text-red-600 hover:bg-red-50",
      ghost: "text-gray-400 hover:text-red-500 hover:bg-red-50",
    },
    indigo: {
      solid: "bg-indigo-600 text-white hover:bg-indigo-700",
      outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
      ghost: "text-indigo-600 hover:bg-indigo-50",
    },
  }[color][variant];

  const sizeClass = {
    sm: "px-3 py-1.5 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  }[size];

  const disabledClass = disabled
    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100 hover:bg-gray-100 hover:text-gray-400"
    : "";

  return (
    <button
      className={`${baseClass} ${
        disabled ? disabledClass : colorClass
      } ${sizeClass} ${className}`}
      disabled={disabled}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
