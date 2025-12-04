import { type FC } from "react";
import FormInput from "../../_common/FormInput";
import Button from "../../_common/Button";
import DiscountForm from "./DiscountForm";
import { ProductWithUI, Discount } from "../../../../types";

interface IProps {
  productForm: Omit<ProductWithUI, "id">;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onStockChange: (value: string) => void;
  onDiscountsChange: (value: Discount[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEditing: boolean;
}

const ProductForm: FC<IProps> = ({
  productForm,
  onNameChange,
  onDescriptionChange,
  onPriceChange,
  onStockChange,
  onDiscountsChange,
  onSubmit,
  onClose,
  isEditing,
}) => {
  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {isEditing ? "상품 수정" : "새 상품 추가"}
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="상품명"
            value={productForm.name}
            required
            onValueChange={onNameChange}
          />

          <FormInput
            label="설명"
            value={productForm.description || ""}
            onValueChange={onDescriptionChange}
          />

          <FormInput
            label="가격"
            type="number"
            value={productForm.price === 0 ? "" : productForm.price}
            required
            placeholder="숫자만 입력"
            onValueChange={onPriceChange}
          />

          <FormInput
            label="재고"
            type="number"
            value={productForm.stock === 0 ? "" : productForm.stock}
            required
            placeholder="숫자만 입력"
            onValueChange={onStockChange}
          />
        </div>

        <DiscountForm
          discounts={productForm.discounts}
          onChange={onDiscountsChange}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            color="gray">
            취소
          </Button>
          <Button type="submit" variant="solid" color="indigo">
            {isEditing ? "수정" : "추가"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
