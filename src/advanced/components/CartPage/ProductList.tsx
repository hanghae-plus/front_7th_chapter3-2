import { getRemainingStock, isSoldOut } from "../../models/cart";
import {
  getStockStatusMessage,
  getAddToCartButtonState,
  getMaxDiscountRate,
  filterProductsBySearch,
} from "../../models/product";
import { formatDiscount, formatPriceUnit } from "../../utils/formatters";
import { ImageIcon } from "../icons";
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";
import { ProductWithUI } from "../../constants";

interface ProductListProps {
  debouncedSearchTerm: string;
}

export const ProductList = ({ debouncedSearchTerm }: ProductListProps) => {
  const { products: allProducts } = useProducts();
  const { cart, addToCart } = useCart();

  const products = filterProductsBySearch(
    allProducts,
    debouncedSearchTerm
  ) as ProductWithUI[];

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const remainingStock = getRemainingStock(product, cart);
            const stockStatus = getStockStatusMessage(remainingStock);
            const buttonState = getAddToCartButtonState(remainingStock);

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* 상품 이미지 영역 (placeholder) */}
                <div className="relative">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-24 h-24 text-gray-300" />
                  </div>
                  {product.isRecommended && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      BEST
                    </span>
                  )}
                  {product.discounts.length > 0 && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      ~{formatDiscount(getMaxDiscountRate(product))}
                    </span>
                  )}
                </div>

                {/* 상품 정보 */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* 가격 정보 */}
                  <div className="mb-3">
                    <p className="text-lg font-bold text-gray-900">
                      {isSoldOut(products, cart, product.id)
                        ? "SOLD OUT"
                        : formatPriceUnit(product.price)}
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
                    {stockStatus && (
                      <p className={stockStatus.className}>
                        {stockStatus.message}
                      </p>
                    )}
                  </div>

                  {/* 장바구니 버튼 */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={buttonState.disabled}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${buttonState.className}`}
                  >
                    {buttonState.label}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductList;
