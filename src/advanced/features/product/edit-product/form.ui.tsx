import { ProductWithUI } from '../../../entities/product';
import { useEditProduct } from './use-edit-product';
import { XIcon } from '../../../shared/ui/icons';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';

interface PropsType {
  product: ProductWithUI;
  onCloseProductForm: () => void;
}

export function EditProductForm({ product, onCloseProductForm }: PropsType) {
  const {
    form,
    onChangeName,
    onChangeDescription,
    onChangePrice,
    onBlurPrice,
    onChangeStock,
    onBlurStock,
    onChangeDiscountQuantity,
    onChangeDiscountRate,
    onRemoveDiscount,
    onAddDiscount,
    onUpdateProduct,
  } = useEditProduct({ product, onCloseProductForm });

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={onUpdateProduct} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">상품 수정</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>상품명</Label>
            <Input
              type="text"
              value={form.name}
              onChange={onChangeName}
              required
            />
          </div>
          <div>
            <Label>설명</Label>
            <Input
              type="text"
              value={form.description}
              onChange={onChangeDescription}
            />
          </div>
          <div>
            <Label>가격</Label>
            <Input
              type="text"
              value={form.price === 0 ? '' : form.price}
              onChange={onChangePrice}
              onBlur={onBlurPrice}
              placeholder="숫자만 입력"
              required
            />
          </div>
          <div>
            <Label>재고</Label>
            <Input
              type="text"
              value={form.stock === 0 ? '' : form.stock}
              onChange={onChangeStock}
              onBlur={onBlurStock}
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <Label size="md">할인 정책</Label>
          <div className="space-y-2">
            {form.discounts.map((discount, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                <Input
                  type="number"
                  size="sm"
                  value={discount.quantity}
                  onChange={onChangeDiscountQuantity(index)}
                  min={1}
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <Input
                  type="number"
                  size="xs"
                  value={discount.rate * 100}
                  onChange={onChangeDiscountRate(index)}
                  min={0}
                  max={100}
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={onRemoveDiscount(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <XIcon />
                </Button>
              </div>
            ))}
            <Button
              variant="link"
              type="button"
              onClick={onAddDiscount}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            type="button"
            onClick={onCloseProductForm}
          >
            취소
          </Button>
          <Button variant="primary" type="submit">
            수정
          </Button>
        </div>
      </form>
    </div>
  );
}
