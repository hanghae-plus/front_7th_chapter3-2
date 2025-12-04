/**
 * Shared UI - Input Component
 * 
 * 재사용 가능한 입력 컴포넌트
 */

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label,
  error,
  fullWidth = false,
  className = '',
  ...props 
}, ref) => {
  const baseStyles = 'px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300';
  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`${baseStyles} ${errorStyles} ${widthStyles} ${disabledStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
