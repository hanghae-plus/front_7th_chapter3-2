export type IconSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface IconProps {
  size?: IconSize;
  className?: string;
  strokeWidth?: number;
}

export const iconSizeClasses: Record<IconSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-16 h-16',
  '3xl': 'w-24 h-24',
};
