import { type FC } from "react";
import Button from "../../_common/Button";
import { Discount } from "../../../../types";
import CloseIcon from "../../_icons/CloseIcon";
import {
  addDiscount,
  removeDiscount,
  updateDiscount,
  getDiscountRatePercent,
} from "../../../models/discount";

interface IProps {
  discounts: Discount[];
  onChange: (newDiscounts: Discount[]) => void;
}

const DiscountForm: FC<IProps> = ({ discounts, onChange }) => {
  const handleQuantityChange = (index: number, value: number) => {
    onChange(updateDiscount(discounts, index, { quantity: value }));
  };

  const handleRateChange = (index: number, ratePercent: number) => {
    onChange(updateDiscount(discounts, index, { rate: ratePercent / 100 }));
  };

  const handleRemoveDiscount = (index: number) => {
    onChange(removeDiscount(discounts, index));
  };

  const handleAddDiscount = () => {
    onChange(addDiscount(discounts));
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        할인 정책
      </label>
      <div className="space-y-2">
        {discounts.map((discount, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-50 p-2 rounded">
            <input
              type="number"
              value={discount.quantity}
              onChange={(e) =>
                handleQuantityChange(index, parseInt(e.target.value) || 0)
              }
              className="w-20 px-2 py-1 border rounded"
              min="1"
              placeholder="수량"
            />
            <span className="text-sm">개 이상 구매 시</span>
            <input
              type="number"
              value={getDiscountRatePercent(discount.rate)}
              onChange={(e) =>
                handleRateChange(index, parseInt(e.target.value) || 0)
              }
              className="w-16 px-2 py-1 border rounded"
              min="0"
              max="100"
              placeholder="%"
            />
            <span className="text-sm">% 할인</span>
            <Button
              type="button"
              variant="ghost"
              color="danger"
              size="sm"
              onClick={() => handleRemoveDiscount(index)}>
              <CloseIcon />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          color="indigo"
          size="sm"
          onClick={handleAddDiscount}>
          + 할인 추가
        </Button>
      </div>
    </div>
  );
};

export default DiscountForm;
