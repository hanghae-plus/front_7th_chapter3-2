import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'dark'
  | 'warning'
  | 'danger'
  | 'ghost'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors',
  secondary:
    'border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors',
  dark: 'bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors',
  warning:
    'bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors',
  danger: 'text-red-600 hover:text-red-900 transition-colors',
  ghost: 'hover:bg-gray-100 transition-colors',
  link: 'hover:underline transition-colors',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-3',
  icon: 'w-6 h-6 flex items-center justify-center',
};

export function getButtonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  disabled: boolean,
  className?: string
): string {
  const baseStyles = 'rounded';
  const variantClass = variantStyles[variant];
  const sizeClass = sizeStyles[size];
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  return [
    baseStyles,
    variantClass,
    sizeClass,
    widthClass,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
}
