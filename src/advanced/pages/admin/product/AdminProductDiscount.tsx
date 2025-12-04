import { Discount } from "../../../../types";
import { IconClose } from "../../../components/common/icons/IconClose";
import { Button } from "../../../components/common/ui/Button";
import { InputField } from "../../../components/common/ui/InputField";
import { isValidDiscountRate, isValidDiscountQuantity } from "../../../utils/validators";

interface AdminProductDiscount {
  index: number;
  discount: { quantity: number; rate: number };
  productForm: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Discount[];
    isRecommended: boolean;
  };
  setProductForm: (product: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Discount[];
    isRecommended: boolean;
  }) => void;
}

export const AdminProductDiscount = ({
  index,
  discount,
  productForm,
  setProductForm,
}: AdminProductDiscount) => {
  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    if (isValidDiscountQuantity(value)) {
      const newDiscounts = [...productForm.discounts];
      newDiscounts[index].quantity = value;
      setProductForm({
        ...productForm,
        discounts: newDiscounts,
      });
    }
  };

  const handleRemoveDiscount = () => {
    const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
    setProductForm({
      ...productForm,
      discounts: newDiscounts,
    });
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentageValue = parseInt(e.target.value, 10) || 0;
    const rate = percentageValue / 100;
    if (isValidDiscountRate(rate)) {
      const newDiscounts = [...productForm.discounts];
      newDiscounts[index].rate = rate;
      setProductForm({
        ...productForm,
        discounts: newDiscounts,
      });
    }
  };

  return (
    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
      <InputField
        type="number"
        value={discount.quantity}
        onChange={handleChangeQuantity}
        className="w-20 px-2 py-1"
        min="1"
        placeholder="수량"
      />
      <span className="text-sm">개 이상 구매 시</span>
      <InputField
        type="number"
        value={discount.rate * 100}
        onChange={handleDiscountChange}
        className="w-20 px-2 py-1"
        min="0"
        max="100"
        placeholder="%"
      />
      <span className="text-sm">% 할인</span>
      <Button
        type="button"
        onClick={handleRemoveDiscount}
        variant="danger"
        size="sm"
      >
        <IconClose />
      </Button>
    </div>
  );
};
