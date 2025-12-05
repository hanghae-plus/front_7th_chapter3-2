import { SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const selectStyles =
  'w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border';

export function getSelectClassName(className?: string): string {
  return [selectStyles, className].filter(Boolean).join(' ').trim();
}
