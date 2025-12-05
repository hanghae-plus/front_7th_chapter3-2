import type { Product, Discount } from '../../../types';
import { ProductCard } from './ProductCard';

type ProductWithUI = Product & { description?: string; isRecommended?: boolean };

interface ProductListProps {
  products: ProductWithUI[];
  totalCount: number;
  searchTerm: string;
  getRemainingStock: (product: Product) => number;
  displayPrice: (price: number, productId?: string) => string;
  getMaxDiscountPercent: (discounts: Discount[]) => number;
  onAddToCart: (product: ProductWithUI) => void;
}

/**
 * 상품 목록 컴포넌트
 *
 * 상품 목록을 그리드 형태로 렌더링합니다.
 * - 총 상품 수 표시
 * - 검색 결과 없을 때 안내 메시지
 * - 상품 카드 그리드
 */
export const ProductList = ({
  products,
  totalCount,
  searchTerm,
  getRemainingStock,
  displayPrice,
  getMaxDiscountPercent,
  onAddToCart
}: ProductListProps) => {
  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {totalCount}개 상품</div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            "{searchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => {
            const remainingStock = getRemainingStock(product);
            const maxDiscountPercent = getMaxDiscountPercent(product.discounts);

            return (
              <ProductCard
                key={product.id}
                product={product}
                remainingStock={remainingStock}
                displayPrice={displayPrice(product.price, product.id)}
                maxDiscountPercent={maxDiscountPercent}
                onAddToCart={() => onAddToCart(product)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
