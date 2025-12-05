import { IconProps, iconSizeClasses } from './icon.types';

export function XIcon({
  size = 'sm',
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
