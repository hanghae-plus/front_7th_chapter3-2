import { formatPrice } from "../../utils/formatter";
import { ProductWithUI } from "../../store/useProductStore";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { useCartStore } from "../../store/useCartStore";
import { useNotificationStore } from "../../store/useNotificationStore";

interface ProductItemProps {
  product: ProductWithUI;
}

/**
 * ProductItem - 상품 아이템 컴포넌트
 *
 * 엔티티 컴포넌트로서 product(엔티티)만 props로 받고,
 * 콜백 함수와 계산값은 내부에서 store를 직접 호출합니다.
 */
export const ProductItem = ({ product }: ProductItemProps) => {
  // Store에서 액션 가져오기
  const { getRemainingStock, addToCart: addToCartAction } = useCartStore();
  const { addNotification } = useNotificationStore();

  // 남은 재고 계산
  const remainingStock = getRemainingStock(product);

  // 장바구니 추가 액션
  const handleAddToCart = () => {
    const result = addToCartAction(product);
    addNotification(result.message, result.success ? "success" : "error");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 상품 이미지 영역 (placeholder) */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <svg
            className="w-24 h-24 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        {product.isRecommended && (
          <Badge variant="red" position="top-right">
            BEST
          </Badge>
        )}
        {product.discounts.length > 0 && (
          <Badge variant="orange" position="top-left">
            ~{Math.max(...product.discounts.map((d) => d.rate)) * 100}%
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
            {remainingStock <= 0 ? "SOLD OUT" : formatPrice(product.price)}
          </p>
          {product.discounts.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.discounts[0].quantity}개 이상 구매시 할인{" "}
              {product.discounts[0].rate * 100}%
            </p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          {remainingStock <= 5 && remainingStock > 0 && (
            <p className="text-xs text-red-600 font-medium">
              품절임박! {remainingStock}개 남음
            </p>
          )}
          {remainingStock > 5 && (
            <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <Button
          onClick={handleAddToCart}
          disabled={remainingStock <= 0}
          fullWidth
        >
          {remainingStock <= 0 ? "품절" : "장바구니 담기"}
        </Button>
      </div>
    </div>
  );
};
