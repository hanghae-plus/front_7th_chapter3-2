import React from "react";
import { XIcon } from "../../../components/icons";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

interface ProductFormState {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: { quantity: number; rate: number }[];
}

interface ProductFormProps {
  productForm: ProductFormState;
  editingProduct: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onStockBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onDiscountChange: (
    index: number,
    field: "quantity" | "rate",
    value: number
  ) => void;
  onRemoveDiscount: (index: number) => void;
  onAddDiscount: () => void;
}

export function ProductForm({
  productForm,
  editingProduct,
  onSubmit,
  onCancel,
  onChange,
  onPriceBlur,
  onStockBlur,
  onDiscountChange,
  onRemoveDiscount,
  onAddDiscount,
}: ProductFormProps) {
  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="상품명"
            type="text"
            name="name"
            value={productForm.name}
            onChange={onChange}
            required
          />
          <Input
            label="설명"
            type="text"
            name="description"
            value={productForm.description}
            onChange={onChange}
          />
          <Input
            label="가격"
            type="text"
            name="price"
            value={productForm.price === 0 ? "" : productForm.price}
            onChange={onChange}
            onBlur={onPriceBlur}
            placeholder="숫자만 입력"
            required
          />
          <Input
            label="재고"
            type="text"
            name="stock"
            value={productForm.stock === 0 ? "" : productForm.stock}
            onChange={onChange}
            onBlur={onStockBlur}
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
                <Input
                  type="number"
                  value={discount.quantity}
                  onChange={(e) =>
                    onDiscountChange(
                      index,
                      "quantity",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-20"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <Input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) =>
                    onDiscountChange(
                      index,
                      "rate",
                      (parseInt(e.target.value) || 0) / 100
                    )
                  }
                  className="w-16"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <Button
                  type="button"
                  onClick={() => onRemoveDiscount(index)}
                  variant="danger"
                  size="sm"
                  className="p-1"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={onAddDiscount}
              variant="ghost"
              size="sm"
              className="text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onCancel} variant="outline">
            취소
          </Button>
          <Button type="submit" variant="primary">
            {editingProduct === "new" ? "추가" : "수정"}
          </Button>
        </div>
      </form>
    </div>
  );
}
