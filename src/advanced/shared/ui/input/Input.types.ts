import { InputHTMLAttributes } from 'react';

export type InputSize = 'full' | 'sm' | 'xs';

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  size?: InputSize;
}

const sizeStyles: Record<InputSize, string> = {
  full: 'w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border',
  sm: 'w-20 px-2 py-1 border rounded',
  xs: 'w-16 px-2 py-1 border rounded',
};

export function getInputClassName(size: InputSize, className?: string): string {
  const sizeClass = sizeStyles[size];

  return [sizeClass, className].filter(Boolean).join(' ').trim();
}
