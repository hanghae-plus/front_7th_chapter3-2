import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-indigo-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-orange-500 text-white',
  danger: 'bg-red-500 text-white',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  return (
    <span
      className={`
        ${variantClasses[variant]}
        text-xs px-2 py-1 rounded
        ${className}
      `
        .trim()
        .replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  );
};
