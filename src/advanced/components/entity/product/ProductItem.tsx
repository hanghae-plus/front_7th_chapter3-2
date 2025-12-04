import { ProductWithUI } from "../../../../types";
import { formatPriceText } from "../../../utils/formatters";
import { IconImagePlaceholder } from "../../common/icons/IconImagePlaceholder";
import { getRemainingStock } from "../../../models/product";
import { addProductToCart } from "../../../models/cart";
import { Button } from "../../common/ui/Button";
import { useCart } from "../../../hooks/useCart";
import { useNotification } from "../../../hooks/useNotification";
import { useProducts } from "../../../hooks/useProducts";

interface ProductItemProps {
  product: ProductWithUI;
}

/**
 * 상품 엔티티 컴포넌트
 * Product 엔티티를 표시하고 조작하는 컴포넌트
 */
export const ProductItem = ({ product }: ProductItemProps) => {
  const { cart, setCart } = useCart();
  const { products } = useProducts();
  const { addNotification } = useNotification();
  const remainingStock = getRemainingStock(product, cart);

  const addToCart = (product: ProductWithUI) => {
    const { cart: nextCart, error } = addProductToCart(cart, product);

    if (error === "OUT_OF_STOCK") {
      addNotification("재고가 부족합니다!", "error");
      return;
    }

    if (error === "EXCEEDS_STOCK") {
      addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
      return;
    }

    setCart(nextCart);
    addNotification("장바구니에 담았습니다", "success");
  };

  return (
    <div
      key={product.id}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* 상품 이미지 영역 (placeholder) */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <IconImagePlaceholder />
        </div>
        {product.isRecommended && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            BEST
          </span>
        )}
        {product.discounts.length > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            ~{Math.max(...product.discounts.map((d) => d.rate)) * 100}%
          </span>
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
            {formatPriceText(product.price, cart, products, product.id)}
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
          onClick={() => addToCart(product)}
          disabled={remainingStock <= 0}
          variant="primary"
          fullWidth
        >
          {remainingStock <= 0 ? "품절" : "장바구니 담기"}
        </Button>
      </div>
    </div>
  );
};
