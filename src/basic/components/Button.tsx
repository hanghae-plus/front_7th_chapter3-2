import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300',
  secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  danger: 'text-red-600 hover:text-red-900',
  ghost: 'text-gray-600 hover:text-gray-900'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

/**
 * 범용 버튼 컴포넌트
 *
 * Entity에 의존하지 않는 순수 UI 컴포넌트입니다.
 * 재사용 가능하며, 스타일 변형을 props로 제어합니다.
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = 'rounded-md font-medium transition-colors disabled:cursor-not-allowed';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
