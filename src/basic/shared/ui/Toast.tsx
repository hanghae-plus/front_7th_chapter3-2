import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/styles';

const variants = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  warning: 'bg-yellow-600',
};

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant: keyof typeof variants;
  children: ReactNode;
  onClose?: () => void;
}

export const Toast = ({
  variant,
  children,
  onClose,
  className,
  ...props
}: ToastProps) => {
  return (
    <div
      className={cn(
        // 1. 베이스 스타일 (패딩, 둥근 모서리, 그림자, 흰색 글씨, 플렉스 배치)
        'p-4 rounded-md shadow-md text-white flex justify-between items-center',

        // 2. 변형 스타일 (배경색)
        variants[variant],

        // 3. 외부 커스텀 스타일
        className,
      )}
      {...props}
    >
      <span className="mr-2">{children}</span>

      {onClose && (
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="닫기"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
