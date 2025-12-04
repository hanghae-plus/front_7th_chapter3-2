import { IconType } from "./type";

export const IconCartSymbol = ({
  className,
  strokeWidth = 1,
  stroke = "currentColor",
}: IconType) => {
  return (
    <svg className={className} fill="none" stroke={stroke} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
};
