import type { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

/**
 * 범용 셀렉트 컴포넌트
 *
 * Entity에 의존하지 않는 순수 UI 컴포넌트입니다.
 */
export const Select = ({ label, className = '', children, ...props }: SelectProps) => {
  const baseStyles =
    'w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500';

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <select className={`${baseStyles} ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
};
