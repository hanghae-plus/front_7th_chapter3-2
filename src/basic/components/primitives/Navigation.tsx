import React from 'react';

interface LogoProps {
  text: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ text, className = '' }) => {
  return (
    <h1 className={`text-xl font-semibold text-gray-800 ${className}`}>
      {text}
    </h1>
  );
};

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = '검색...',
  className = '',
}) => {
  return (
    <div className={`ml-8 flex-1 max-w-md ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

interface CartBadgeProps {
  count: number;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ count }) => {
  return (
    <div className="relative">
      <svg
        className="w-6 h-6 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
};

interface ToggleButtonProps {
  isActive: boolean;
  activeText: string;
  inactiveText: string;
  onClick: () => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isActive,
  activeText,
  inactiveText,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded transition-colors ${
        isActive
          ? 'bg-gray-800 text-white'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {isActive ? activeText : inactiveText}
    </button>
  );
};
