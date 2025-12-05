import { useCartStore } from '@/features/cart';
import { getRemainingStock } from '@/features/cart';
import { Product } from '@/features/product';
import { useNotification } from '@/shared/contexts';
import { formatPrice } from '@/shared/utils';
import { Button, Badge, ImageIcon } from '@/shared/ui';
import { useMemo } from 'react';

interface ProductItemProps {
  product: Product;
}

export const ProductItem = ({ product }: ProductItemProps) => {
  const { addNotification } = useNotification();
  const { cart, addToCart } = useCartStore();

  const remainingStock = useMemo(
    () => getRemainingStock(cart, product),
    [cart, product]
  );

  const handleAddToCart = () => {
    addToCart(product, {
      onSuccess: ({ message }) =>
        addNotification(message || '장바구니에 담았습니다', 'success'),
      onError: ({ message }) => addNotification(message, 'error'),
    });
  };

  const maxDiscountRate = useMemo(() => {
    if (product.discounts.length === 0) return 0;
    return Math.max(...product.discounts.map((d) => d.rate)) * 100;
  }, [product.discounts]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 상품 이미지 영역 (placeholder) */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <ImageIcon />
        </div>
        {product.isRecommended && (
          <Badge variant="red" className="absolute top-2 right-2">
            BEST
          </Badge>
        )}
        {maxDiscountRate > 0 && (
          <Badge variant="orange" className="absolute top-2 left-2">
            ~{maxDiscountRate}%
          </Badge>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* 가격 정보 */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}원
          </p>
          {product.discounts.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.discounts[0].quantity}개 이상 구매시{' '}
              {product.discounts[0].rate * 100}% 할인
            </p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          {remainingStock <= 0 ? (
            <p className="text-xs text-red-600 font-medium">품절</p>
          ) : remainingStock <= 5 ? (
            <p className="text-xs text-red-600 font-medium">
              품절임박! {remainingStock}개 남음
            </p>
          ) : (
            <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <Button
          variant="dark"
          onClick={handleAddToCart}
          disabled={remainingStock <= 0}
          className="w-full"
        >
          {remainingStock <= 0 ? '품절' : '장바구니 담기'}
        </Button>
      </div>
    </div>
  );
};
