import { Product, ProductValidation, useProductForm } from '@/features/product';
import { useNotification } from '@/shared/contexts';
import { Input, Button, IconButton, XIcon } from '@/shared/ui';
interface ProductFormProps {
  addProduct?: (
    product: Omit<Product, 'id'>,
    options?: {
      onSuccess?: (validation: ProductValidation) => void;
      onError?: (validation: ProductValidation) => void;
    }
  ) => void;
  updateProduct?: (
    product: Partial<Product>,
    options?: {
      onSuccess?: (validation: ProductValidation) => void;
      onError?: (validation: ProductValidation) => void;
    }
  ) => void;
  editingProduct?: Product | null;
  close: () => void;
}

export const ProductForm = ({
  addProduct,
  updateProduct,
  editingProduct,
  close,
}: ProductFormProps) => {
  const { addNotification } = useNotification();
  const isEditMode = !!editingProduct;

  const { form, onBlurHandler, onChangeHandler, onSubmit, setForm } =
    useProductForm(
      (product, options) => {
        if (isEditMode && updateProduct && editingProduct) {
          updateProduct({ ...product, id: editingProduct.id }, options);
        } else if (addProduct) {
          addProduct(product, options);
        } else {
          options?.onError?.({
            valid: false,
            error: 'NOT_FOUND',
            message: '작업을 수행할 수 없습니다.',
          });
        }
      },
      close,
      editingProduct
    );

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form
        onSubmit={(e) => {
          onSubmit(e, {
            onSuccess: ({ message }) =>
              addNotification(message || '상품이 저장되었습니다', 'success'),
            onError: ({ message }) => addNotification(message, 'error'),
          });
        }}
        className="space-y-4"
      >
        <h3 className="text-lg font-medium text-gray-900">
          {isEditMode ? '상품 수정' : '새 상품 추가'}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </label>
            <Input
              type="text"
              value={form.name}
              onChange={onChangeHandler('name')}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <Input
              type="text"
              value={form.description}
              onChange={onChangeHandler('description')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가격
            </label>
            <Input
              type="text"
              value={form.price === 0 ? '' : form.price}
              onChange={onChangeHandler('price')}
              onBlur={(e) => {
                onBlurHandler('price', {
                  onError: ({ message }) => addNotification(message, 'error'),
                })(e);
              }}
              placeholder="숫자만 입력"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              재고
            </label>
            <Input
              type="text"
              value={form.stock === 0 ? '' : form.stock}
              onChange={onChangeHandler('stock')}
              onBlur={(e) => {
                onBlurHandler('stock', {
                  onError: ({ message }) => addNotification(message, 'error'),
                })(e);
              }}
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            할인 정책
          </label>
          <div className="space-y-2">
            {form.discounts.map((discount, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                <input
                  type="number"
                  value={discount.quantity}
                  onChange={(e) => {
                    const newDiscounts = [...form.discounts];
                    newDiscounts[index].quantity =
                      parseInt(e.target.value) || 0;
                    setForm({ ...form, discounts: newDiscounts });
                  }}
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) => {
                    const newDiscounts = [...form.discounts];
                    newDiscounts[index].rate =
                      (parseInt(e.target.value) || 0) / 100;
                    setForm({ ...form, discounts: newDiscounts });
                  }}
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <IconButton
                  variant="danger"
                  onClick={() => {
                    const newDiscounts = form.discounts.filter(
                      (_, i) => i !== index
                    );
                    setForm({ ...form, discounts: newDiscounts });
                  }}
                  icon={<XIcon />}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setForm({
                  ...form,
                  discounts: [...form.discounts, { quantity: 10, rate: 0.1 }],
                });
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => close()}>
            취소
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? '수정' : '추가'}
          </Button>
        </div>
      </form>
    </div>
  );
};
