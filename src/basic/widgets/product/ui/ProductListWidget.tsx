import { useProductList } from '../../../entities/product/model/useProductList';
import { useCart } from '../../../entities/cart/model/useCart';
import { searchProducts } from '../../../entities/product/lib/search';
import { ProductCard } from '../../../entities/product/ui/ProductCard';
import { EmptySearchResult } from '../../../entities/product/ui/EmptySearchResult';
import { AddToCartButton } from '../../../features/cart/ui/AddToCartButton';
import { ToastMessage } from '../../../shared/hooks/useToast';

interface ProductListWidgetProps {
  searchTerm: string; // debounced된 값을 받음
  onShowToast?: (message: string, type: ToastMessage['type']) => void;
}

export const ProductListWidget = ({
  searchTerm,
  onShowToast,
}: ProductListWidgetProps) => {
  const { products } = useProductList();
  const { cart } = useCart();

  const filteredProducts = searchProducts(products, searchTerm);

  const getUsedQuantity = (productId: string): number => {
    const cartItem = cart.find((item) => item.product.id === productId);
    return cartItem?.quantity ?? 0;
  };

  return (
    <section>
      {/* 헤더 */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">
          총 {filteredProducts.length}개 상품
        </div>
      </div>

      {/* 상품 목록 */}
      {filteredProducts.length === 0 ? (
        <EmptySearchResult searchTerm={searchTerm} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              usedQuantity={getUsedQuantity(product.id)}
              action={
                <AddToCartButton product={product} onShowToast={onShowToast} />
              }
            />
          ))}
        </div>
      )}
    </section>
  );
};
