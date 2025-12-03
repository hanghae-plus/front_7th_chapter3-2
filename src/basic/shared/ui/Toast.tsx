import { HTMLAttributes, ReactNode } from 'react';

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant: keyof typeof variants;
  children: ReactNode;
  onClose?: () => void;
}

const variants = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  warning: 'bg-yellow-600',
};

const Toast = ({
  variant,
  children,
  onClose,
  className = '',
  ...props
}: ToastProps) => {
  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="mr-2">{children}</span>
      {onClose && (
        <button onClick={onClose} className="text-white hover:text-gray-200">
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

export default Toast;
