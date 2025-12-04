import { useCallback } from "react";
import { formatPrice } from "../../utils/formatters";
import { ProductWithUI } from "../../hooks/useProducts";
import { ProductItem } from "./ProductItem";

export const ProductList = ({
  filteredProducts,
  searchTerm,
  remainingStock,
  addToCart,
}: {
  filteredProducts: ProductWithUI[];
  searchTerm: string;
  remainingStock: (product: ProductWithUI) => number;
  addToCart: (product: ProductWithUI) => void;
}) => {
  const productPrice = useCallback(
    (price: number, productId?: string) => {
      if (productId) {
        const product = filteredProducts.find((p) => p.id === productId);
        if (product && remainingStock(product) <= 0) {
          return "SOLD OUT";
        }
      }
      return formatPrice(price, "₩");
    },
    [filteredProducts, remainingStock]
  );

  return (
    <section>
      <div className='mb-6 flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
        <div className='text-sm text-gray-600'>총 {filteredProducts.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-500'>"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              stock={remainingStock(product)}
              productPrice={productPrice}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};
