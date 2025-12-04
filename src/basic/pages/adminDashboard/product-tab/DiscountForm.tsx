import { DiscountFormState, ProductFormState } from '../../../entities/product/types';
import { getDeletedDiscounts } from '../../../entities/product/utils';

interface DiscountFormProps {
  index: number;
  productForm: ProductFormState;
  discount: DiscountFormState;
  setProductForm: (productForm: ProductFormState) => void;
}

export default function DiscountForm({
  index,
  productForm,
  discount,
  setProductForm,
}: DiscountFormProps) {
  const handleChangeFormQuantity = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductForm(() => {
      const newDiscounts = [...productForm.discounts];
      newDiscounts[index].quantity = parseInt(value) || 0;
      return { ...productForm, discounts: newDiscounts };
    });
  };

  const handleChangeFormRate = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductForm(() => {
      const newDiscounts = [...productForm.discounts];
      newDiscounts[index].rate = (parseInt(value) || 0) / 100;
      return { ...productForm, discounts: newDiscounts };
    });
  };

  const handleDeleteDiscount = (index: number) => {
    setProductForm({
      ...productForm,
      discounts: getDeletedDiscounts(productForm.discounts, index),
    });
  };

  return (
    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
      <input
        type="number"
        id="quantity"
        value={discount.quantity}
        onChange={e => {
          handleChangeFormQuantity(index, e);
        }}
        className="w-20 px-2 py-1 border rounded"
        min="1"
        placeholder="수량"
      />
      <span className="text-sm">개 이상 구매 시</span>
      <input
        type="number"
        id="rate"
        value={discount.rate * 100}
        onChange={e => {
          handleChangeFormRate(index, e);
        }}
        className="w-16 px-2 py-1 border rounded"
        min="0"
        max="100"
        placeholder="%"
      />
      <span className="text-sm">% 할인</span>
      <button
        type="button"
        onClick={() => {
          handleDeleteDiscount(index);
        }}
        className="text-red-600 hover:text-red-800"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
