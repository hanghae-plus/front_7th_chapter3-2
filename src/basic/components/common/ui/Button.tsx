import { ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "text"
  | "text_update"
  | "icon"
  | "tab";

type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  active?: boolean; // 탭 버튼용
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-gray-800 text-white hover:bg-gray-800 rounded-md",
  secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md",
  danger: "text-red-600 hover:text-red-900 rounded-md",
  success: "bg-indigo-600 text-white hover:bg-indigo-700 rounded-md",
  warning: "bg-yellow-400 text-gray-900 hover:bg-yellow-500 rounded-md",
  text: "text-gray-600 hover:text-gray-900 rounded-md",
  text_update: "text-indigo-600 hover:text-indigo-900 mr-3",
  icon: "text-gray-400 hover:text-gray-200 rounded-md",
  tab: "border-b-2 font-medium transition-colors",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "text-xs px-2 py-1",
  sm: "text-sm px-3 py-1.5",
  md: "px-4 py-2 text-sm font-medium",
  lg: "px-4 py-3 text-base font-medium",
};

const tabActiveStyles = "border-gray-900 text-gray-900";
const tabInactiveStyles =
  "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

export const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  children,
  active,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClass =
    variant === "tab"
      ? active
        ? `${variantStyles[variant]} ${tabActiveStyles}`
        : `${variantStyles[variant]} ${tabInactiveStyles}`
      : variantStyles[variant];

  const sizeClass =
    variant === "tab"
      ? "py-2 px-1 text-sm"
      : variant === "icon"
      ? ""
      : sizeStyles[size];
  const widthClass = fullWidth ? "w-full" : "";
  const iconOnlyClass = variant === "icon" && !children ? "p-1" : "";

  const combinedClassName = [
    baseStyles,
    variantClass,
    sizeClass,
    widthClass,
    iconOnlyClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {icon && <span className={children ? "mr-2" : ""}>{icon}</span>}
      {children}
    </button>
  );
};
