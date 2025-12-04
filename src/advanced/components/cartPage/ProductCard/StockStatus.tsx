import { type FC } from "react";

interface IProps {
  isLowStock: boolean;
  message: string;
}

const StockStatus: FC<IProps> = ({ isLowStock, message }) => {
  if (!message) return null;

  return (
    <p
      className={`text-xs font-medium ${
        isLowStock ? "text-red-600" : "text-gray-500"
      }`}>
      {message}
    </p>
  );
};

export default StockStatus;
