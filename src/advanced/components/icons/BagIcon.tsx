import { SvgBase } from "./SvgBase";

export const BagIcon = ({
  className = "w-16 h-16 text-gray-300 mx-auto mb-4",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <SvgBase className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={strokeWidth}
        d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
      />
    </SvgBase>
  );
};
