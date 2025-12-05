import React from 'react';

type ToastVariant = 'error' | 'success' | 'warning';

interface ToastProps {
  message: string;
  variant: ToastVariant;
  onClose: () => void;
}

const variantStyles: Record<ToastVariant, string> = {
  error: 'bg-red-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
};

export const Toast: React.FC<ToastProps> = ({ message, variant, onClose }) => {
  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${variantStyles[variant]}`}
    >
      <span className="mr-2">{message}</span>
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
    </div>
  );
};
