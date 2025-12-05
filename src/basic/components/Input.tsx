import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * 범용 입력 컴포넌트
 *
 * Entity에 의존하지 않는 순수 UI 컴포넌트입니다.
 * 레이블과 에러 메시지를 포함할 수 있습니다.
 */
export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  const baseStyles =
    'w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <input className={`${baseStyles} ${errorStyles} ${className}`} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
