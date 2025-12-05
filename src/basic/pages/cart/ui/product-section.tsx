import { CartItem } from '../../../../types';
import {
  filterProductsBySearchTerm,
  ProductWithUI,
} from '../../../entities/product';
import { ConditionalRender } from '../../../shared/ui/conditional-render';
import { ToastProps } from '../../../shared/ui/toast';
import { ProductCardList } from './product-card-list';
import { ProductEmptyFallback } from './product-empty-fallback';

interface PropsType {
  products: ProductWithUI[];
  cart: CartItem[];
  searchTerm: string;
  addToCart: (product: ProductWithUI) => void;
  toast: (notification: ToastProps) => void;
}

export function ProductSection({
  products,
  cart,
  searchTerm,
  addToCart,
  toast,
}: PropsType) {
  const filteredProducts = filterProductsBySearchTerm(products, searchTerm);

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>

      <ConditionalRender
        condition={filteredProducts.length > 0}
        fallback={<ProductEmptyFallback searchTerm={searchTerm} />}
      >
        <ProductCardList
          products={filteredProducts}
          cart={cart}
          addToCart={addToCart}
          toast={toast}
        />
      </ConditionalRender>
    </section>
  );
}
