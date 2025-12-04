import { IconType } from "./type";

export const IconAdd = ({
  className = "w-8 h-8",
  strokeWidth = 2,
  stroke = "currentColor",
}: IconType) => {
  return (
    <svg className={className} fill="none" stroke={stroke} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
};
