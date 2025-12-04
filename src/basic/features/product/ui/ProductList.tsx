import { Notification } from '@/shared/hooks';
import { Product, ProductItem } from '@/features/product';
import { CartItem, CartValidation } from '@/features/cart';

export const ProductList = ({
  products,
  cart,
  addToCart,
  addNotification,
  isLoading,
  query,
}: {
  products: Product[];
  cart: CartItem[];
  addToCart: (
    product: Product,
    options?: {
      onSuccess?: (validation: CartValidation) => void;
      onError?: (validation: CartValidation) => void;
    }
  ) => void;
  addNotification: (message: string, type: Notification['type']) => void;
  isLoading: boolean;
  query: string;
}) => {
  return (
    <section>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
          <div className="text-sm text-gray-600">
            총 {products.length}개 상품
            {isLoading && (
              <span className="ml-2 text-blue-600">검색 중...</span>
            )}
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {query
              ? `"${query}"에 대한 검색 결과가 없습니다.`
              : '상품이 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              cart={cart}
              onAddToCart={addToCart}
              addNotification={addNotification}
            />
          ))}
        </div>
      )}
    </section>
  );
};
