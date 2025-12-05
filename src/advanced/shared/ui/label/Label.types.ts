import { LabelHTMLAttributes, ReactNode } from 'react';

export type LabelSize = 'sm' | 'md';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  size?: LabelSize;
  children?: ReactNode;
}

const sizeStyles: Record<LabelSize, string> = {
  sm: 'block text-sm font-medium text-gray-700 mb-1',
  md: 'block text-sm font-medium text-gray-700 mb-2',
};

export function getLabelClassName(size: LabelSize, className?: string): string {
  const sizeClass = sizeStyles[size];

  return [sizeClass, className].filter(Boolean).join(' ').trim();
}
