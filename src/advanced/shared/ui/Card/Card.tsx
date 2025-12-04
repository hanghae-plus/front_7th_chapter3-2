/**
 * Shared UI - Card Component
 * 
 * 콘텐츠를 담는 카드 컴포넌트
 */

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  shadow = 'md'
}: CardProps) => {
  const baseStyles = 'bg-white rounded-lg border border-gray-200';
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div className={`${baseStyles} ${paddingStyles[padding]} ${shadowStyles[shadow]} ${className}`}>
      {children}
    </div>
  );
};
