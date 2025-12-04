import { Product } from '../../../types';
import { ProductWithUI } from '../../hooks/useProducts';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: ProductWithUI[];
  totalCount: number;
  searchTerm: string;
  getRemainingStock: (product: Product) => number;
  onAddToCart: (product: ProductWithUI) => void;
}

export function ProductList({
  products,
  totalCount,
  searchTerm,
  getRemainingStock,
  onAddToCart,
}: ProductListProps) {
  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {totalCount}개 상품</div>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              remainingStock={getRemainingStock(product)}
              onAddToCart={() => onAddToCart(product)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
