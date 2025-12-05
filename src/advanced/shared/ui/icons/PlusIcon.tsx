import { IconProps, iconSizeClasses } from './icon.types';

export function PlusIcon({
  size = 'xl',
  className = '',
  strokeWidth = 2,
}: IconProps) {
  const sizeClass = iconSizeClasses[size];

  return (
    <svg
      className={`${sizeClass} ${className}`.trim()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}
