import React from 'react';
import { ProductCardContainer } from './ProductCardContainer';
import { ProductWithUI } from '../../hooks/useProducts';
import { getRemainingStock } from '../../models/cart';
import { useCartContext } from '../../contexts';

interface ProductListProps {
  products: ProductWithUI[];
  onAddToCart: (product: ProductWithUI) => void;
  searchTerm?: string;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToCart,
  searchTerm = '',
}) => {
  const { cart } = useCartContext();
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          "{searchTerm}"에 대한 검색 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const remainingStock = getRemainingStock({ product, cart });

          return (
            <ProductCardContainer
              key={product.id}
              product={product}
              remainingStock={remainingStock}
              onAddToCart={onAddToCart}
            />
          );
        })}
      </div>
    </section>
  );
};
