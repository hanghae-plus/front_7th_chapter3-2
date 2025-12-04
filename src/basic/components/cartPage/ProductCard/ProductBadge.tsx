import { type FC } from "react";

interface IProps {
  type: "best" | "discount";
  value?: number;
}

const ProductBadge: FC<IProps> = ({ type, value }) => {
  if (type === "best") {
    return (
      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
        BEST
      </span>
    );
  }

  if (type === "discount" && value !== undefined) {
    return (
      <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
        ~{value}%
      </span>
    );
  }

  return null;
};

export default ProductBadge;
