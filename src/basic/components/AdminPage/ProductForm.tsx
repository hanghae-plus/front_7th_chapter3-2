import React from "react";
import { EMPTY_PRODUCT_FORM } from "../../constants";
import {
  validateProductPrice,
  validateProductStock,
} from "../../models/product";
import { isNumericInput } from "../../utils/validators";
import { Button, FormInput } from "../ui";
import { CloseIcon } from "../icons";

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

interface ProductFormProps {
  productForm: ProductFormData;
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
  editingProduct: string | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<string | null>>;
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (e: React.FormEvent) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const ProductForm = ({
  productForm,
  setProductForm,
  editingProduct,
  setEditingProduct,
  setShowProductForm,
  onSubmit,
  addNotification,
}: ProductFormProps) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductForm({ ...productForm, name: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductForm({ ...productForm, description: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNumericInput(value)) {
      setProductForm({
        ...productForm,
        price: value === "" ? 0 : parseInt(value),
      });
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNumericInput(value)) {
      setProductForm({
        ...productForm,
        stock: value === "" ? 0 : parseInt(value),
      });
    }
  };

  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const result = validateProductPrice(value);

    if (!result.isValid) {
      if (result.error) {
        addNotification(result.error, "error");
      }
      if (result.correctedValue !== undefined) {
        setProductForm({ ...productForm, price: result.correctedValue });
      }
    }
  };

  const handleStockBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const result = validateProductStock(value);

    if (!result.isValid) {
      if (result.error) {
        addNotification(result.error, "error");
      }
      if (result.correctedValue !== undefined) {
        setProductForm({ ...productForm, stock: result.correctedValue });
      }
    }
  };

  const handleDiscountQuantityChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDiscounts = [...productForm.discounts];
    newDiscounts[index].quantity = parseInt(e.target.value) || 0;
    setProductForm({ ...productForm, discounts: newDiscounts });
  };

  const handleDiscountRateChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDiscounts = [...productForm.discounts];
    newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
    setProductForm({ ...productForm, discounts: newDiscounts });
  };

  const handleRemoveDiscount = (index: number) => {
    const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
    setProductForm({ ...productForm, discounts: newDiscounts });
  };

  const handleAddDiscount = () => {
    setProductForm({
      ...productForm,
      discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
    });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT_FORM);
    setShowProductForm(false);
  };

  const formTitle = editingProduct === "new" ? "새 상품 추가" : "상품 수정";
  const submitButtonText = editingProduct === "new" ? "추가" : "수정";

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{formTitle}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="상품명"
            type="text"
            value={productForm.name}
            onChange={handleNameChange}
            required
          />
          <FormInput
            label="설명"
            type="text"
            value={productForm.description}
            onChange={handleDescriptionChange}
          />
          <FormInput
            label="가격"
            type="text"
            value={productForm.price === 0 ? "" : productForm.price}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            placeholder="숫자만 입력"
            required
          />
          <FormInput
            label="재고"
            type="text"
            value={productForm.stock === 0 ? "" : productForm.stock}
            onChange={handleStockChange}
            onBlur={handleStockBlur}
            placeholder="숫자만 입력"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            할인 정책
          </label>
          <div className="space-y-2">
            {productForm.discounts.map((discount, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                <input
                  type="number"
                  value={discount.quantity}
                  onChange={(e) => handleDiscountQuantityChange(index, e)}
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) => handleDiscountRateChange(index, e)}
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDiscount(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDiscount}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" type="submit">
            {submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
