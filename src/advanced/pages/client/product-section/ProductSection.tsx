import { canAddToCart, getAddToCart } from '../../../entities/cart';
import { type ProductWithUI, filterProducts, getRemainingStock } from '../../../entities/product';
import ProductCard from './ProductCard';
import { useProductContext } from '../../../entities/product/contexts/productContext';
import { useCartContext } from '../../../entities/cart/contexts/cartContext';
interface ProductSectionProps {
  debouncedSearchTerm: string;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export default function ProductSection({
  debouncedSearchTerm,
  addNotification,
}: ProductSectionProps) {
  const { products } = useProductContext();
  const { cart, setCart } = useCartContext();
  const filteredProducts = filterProducts(products, debouncedSearchTerm);

  // Events
  const addToCart = (product: ProductWithUI) => {
    if (!canAddToCart(cart, product)) {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
      } else {
        addNotification(`재고는 ${remainingStock}개까지만 있습니다.`, 'error');
      }
      return;
    }

    setCart(getAddToCart(cart, product));
    addNotification('장바구니에 담았습니다', 'success');
  };
  return (
    <div className="lg:col-span-3">
      {/* 상품 목록 */}
      <section>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
          <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => {
              const remainingStock = getRemainingStock(product, cart);

              return (
                <ProductCard
                  key={`product-card-${product.id}`}
                  product={product}
                  remainingStock={remainingStock}
                  addToCart={addToCart}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
