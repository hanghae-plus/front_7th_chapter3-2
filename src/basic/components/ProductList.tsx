import React from 'react';
import { ProductCard } from './ui/ProductCard';
import { ProductWithUI } from '../hooks/useProducts';
import { CartItem } from '../../types';
import { getRemainingStock } from '../utils/formatters';

interface ProductListProps {
  products: ProductWithUI[];
  cart: CartItem[];
  isAdmin: boolean;
  formatPrice: (price: number, productId?: string) => string;
  onAddToCart: (product: ProductWithUI) => void;
  searchTerm?: string;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  cart,
  formatPrice,
  onAddToCart,
  searchTerm = '',
}) => {
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
          const remainingStock = getRemainingStock(product, cart);

          return (
            <ProductCard
              key={product.id}
              product={product}
              remainingStock={remainingStock}
              formatPrice={formatPrice}
              onAddToCart={onAddToCart}
            />
          );
        })}
      </div>
    </section>
  );
};
