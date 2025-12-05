import { ChangeEvent, FormEvent, useState } from 'react';
import { NewProduct, Product } from '../../../entities/product/model/types';
import { ToastMessage } from '../../../shared/hooks/useToast';
import { useProductList } from '../../../entities/product/model/useProductList';
import { Input } from '../../../shared/ui/Input';
import { isValidPrice, isValidStock } from '../../../entities/product/lib';
import { extractNumbers, isOnlyNumber } from '../../../shared/lib/validators';
import { CloseIcon } from '../../../shared/ui/Icons';
import { Button } from '../../../shared/ui/Button';

interface ProductFormProps {
  initialData?: Product;
  onShowToast?: (message: string, type: ToastMessage['type']) => void;
  onClose?: () => void;
}

export const ProductForm = ({
  initialData,
  onShowToast,
  onClose,
}: ProductFormProps) => {
  const { addProduct, updateProduct } = useProductList();
  const [formData, setFormData] = useState<NewProduct>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [],
    ...initialData,
  });

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || isOnlyNumber(value)) {
      setFormData({
        ...formData,
        price: value === '' ? 0 : Number(value),
      });
    }
  };

  const handlePriceBlur = () => {
    if (!isValidPrice(formData.price) && formData.price < 0) {
      onShowToast?.('가격은 0보다 커야 합니다', 'error');
      setFormData({ ...formData, price: 0 });
    }
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || isOnlyNumber(value)) {
      setFormData({
        ...formData,
        stock: value === '' ? 0 : Number(value),
      });
    }
  };

  const handleStockBlur = () => {
    if (!isValidStock(formData.stock)) {
      onShowToast?.('재고는 0보다 커야 합니다', 'error');
      setFormData({ ...formData, stock: 0 });
      return;
    }

    if (formData.stock > 9999) {
      onShowToast?.('재고는 9999개를 초과할 수 없습니다', 'error');
      setFormData({ ...formData, stock: 9999 });
    }
  };

  const handleDiscountChange = (
    index: number,
    field: 'quantity' | 'rate',
    value: string,
  ) => {
    const cleanValue = extractNumbers(value);
    const numValue = cleanValue === '' ? 0 : Number(cleanValue);

    const newDiscounts = [...formData.discounts];

    if (field === 'rate') {
      newDiscounts[index].rate = numValue / 100;
    } else {
      newDiscounts[index].quantity = numValue;
    }

    setFormData({ ...formData, discounts: newDiscounts });
  };

  const handleRemoveDiscount = (index: number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      discounts: prevFormData.discounts.filter((_, i) => i !== index),
    }));
  };

  const handleAddDiscount = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      discounts: [...prevFormData.discounts, { quantity: 10, rate: 0.1 }],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (initialData) {
      updateProduct(initialData.id, formData);
      onShowToast?.('상품이 수정되었습니다.', 'success');
    } else {
      addProduct(formData);
      onShowToast?.('상품이 추가되었습니다.', 'success');
    }

    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        {initialData ? '상품 수정' : '새 상품 추가'}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상품명
          </label>
          <Input
            variant="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <Input
            variant="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            가격
          </label>
          <Input
            variant="text"
            type="text"
            value={formData.price === 0 ? '' : formData.price}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            placeholder="숫자만 입력"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            재고
          </label>
          <Input
            variant="text"
            type="text"
            value={formData.stock === 0 ? '' : formData.stock}
            onChange={handleStockChange}
            onBlur={handleStockBlur}
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
          {formData.discounts.map((discount, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-50 p-2 rounded"
            >
              <Input
                type="number"
                variant="number"
                className="w-20 border"
                placeholder="수량"
                min="1"
                value={discount.quantity}
                onChange={(e) =>
                  handleDiscountChange(index, 'quantity', e.target.value)
                }
              />
              <span className="text-sm">개 이상 구매 시</span>
              <Input
                type="number"
                variant="number"
                className="w-16 border"
                placeholder="%"
                min="0"
                max="100"
                value={discount.rate * 100}
                onChange={(e) =>
                  handleDiscountChange(index, 'rate', e.target.value)
                }
              />
              <span className="text-sm">% 할인</span>
              <Button
                variant="delete"
                type="button"
                onClick={() => handleRemoveDiscount(index)}
              >
                <CloseIcon />
              </Button>
            </div>
          ))}
          <Button
            variant="subtle"
            onClick={handleAddDiscount}
            type="button"
            className="text-sm"
          >
            + 할인 추가
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onClose} type="button">
          취소
        </Button>
        <Button size="sm" variant="primary" type="submit">
          {initialData ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  );
};
