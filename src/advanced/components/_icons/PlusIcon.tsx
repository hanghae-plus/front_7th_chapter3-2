import { type FC } from "react";

interface IProps {}

const PlusIcon: FC<IProps> = ({}) => {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
};

export default PlusIcon;
