import { type FC } from "react";
import FormInput from "./FormInput";
import Button from "../../_common/Button";
import DiscountForm from "./DiscountForm";
import { ProductWithUI } from "../../../../types";

interface IProps {
  productForm: Omit<ProductWithUI, "id">;
  setProductForm: (productForm: Omit<ProductWithUI, "id">) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEditing: boolean;
}

const ProductForm: FC<IProps> = ({
  productForm,
  setProductForm,
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
            onChange={(value) =>
              setProductForm({ ...productForm, name: value })
            }
          />

          <FormInput
            label="설명"
            value={productForm.description || ""}
            onChange={(value) =>
              setProductForm({ ...productForm, description: value })
            }
          />

          <FormInput
            label="가격"
            type="number"
            value={productForm.price === 0 ? "" : productForm.price}
            required
            placeholder="숫자만 입력"
            onChange={(value) => {
              const numValue = value === "" ? 0 : parseInt(value);
              if (!isNaN(numValue) && numValue >= 0) {
                setProductForm({ ...productForm, price: numValue });
              }
            }}
          />

          <FormInput
            label="재고"
            type="number"
            value={productForm.stock === 0 ? "" : productForm.stock}
            required
            placeholder="숫자만 입력"
            onChange={(value) => {
              const numValue = value === "" ? 0 : parseInt(value);
              if (!isNaN(numValue) && numValue >= 0 && numValue <= 9999) {
                setProductForm({ ...productForm, stock: numValue });
              }
            }}
          />
        </div>

        <DiscountForm
          discounts={productForm.discounts}
          onChange={(newDiscounts) =>
            setProductForm({ ...productForm, discounts: newDiscounts })
          }
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
