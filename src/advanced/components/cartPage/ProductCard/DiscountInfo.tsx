import { type FC } from "react";

interface IProps {
  quantity: number;
  rate: number;
}

const DiscountInfo: FC<IProps> = ({ quantity, rate }) => {
  return (
    <p className="text-xs text-gray-500">
      {quantity}개 이상 구매시 할인 {rate}%
    </p>
  );
};

export default DiscountInfo;
