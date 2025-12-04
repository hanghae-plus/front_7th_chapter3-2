/**
 * Shared UI - Badge Component
 * 
 * 숫자나 상태를 표시하는 배지 컴포넌트
 */

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full';
  
  const variantStyles = {
    primary: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-500 text-white',
    info: 'bg-gray-500 text-white'
  };
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs min-w-[1.25rem] h-5',
    md: 'px-2.5 py-1 text-sm min-w-[1.5rem] h-6',
    lg: 'px-3 py-1.5 text-base min-w-[2rem] h-8'
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
