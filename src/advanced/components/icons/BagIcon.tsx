export const BagIcon = ({
  size,
  strokeWidth = 1,
  className,
}: {
  size: number;
  strokeWidth?: number;
  className?: string;
}) => {
  return (
    <svg className={`w-${size} h-${size} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
};
