import { type FC } from "react";
import Button from "../../_common/Button";
import { Discount } from "../../../../types";

interface IProps {
  discounts: Discount[];
  onChange: (newDiscounts: Discount[]) => void;
}

const DiscountForm: FC<IProps> = ({ discounts, onChange }) => {
  const handleQuantityChange = (index: number, value: number) => {
    const newDiscounts = [...discounts];
    newDiscounts[index] = { ...newDiscounts[index], quantity: value };
    onChange(newDiscounts);
  };

  const handleRateChange = (index: number, value: number) => {
    const newDiscounts = [...discounts];
    newDiscounts[index] = { ...newDiscounts[index], rate: value / 100 };
    onChange(newDiscounts);
  };

  const handleRemoveDiscount = (index: number) => {
    const newDiscounts = discounts.filter((_, i) => i !== index);
    onChange(newDiscounts);
  };

  const handleAddDiscount = () => {
    onChange([...discounts, { quantity: 10, rate: 0.1 }]);
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
              value={Math.round(discount.rate * 100)}
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
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
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
