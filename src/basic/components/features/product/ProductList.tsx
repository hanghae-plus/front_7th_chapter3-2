import { ProductWithUI } from '../../../constants';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  searchTerm: string;
  onAddToCart: (product: ProductWithUI) => void;
  getRemainingStock: (product: ProductWithUI) => number;
  formatPrice: (price: number, productId?: string) => string;
}

// 상품 목록을 표시하는 섹션 컴포넌트
export const ProductList = ({
  products,
  filteredProducts,
  searchTerm,
  onAddToCart,
  getRemainingStock,
  formatPrice
}: ProductListProps) => {
  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">
          총 {products.length}개 상품
        </div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              remainingStock={getRemainingStock(product)}
              onAddToCart={onAddToCart}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      )}
    </section>
  );
};

