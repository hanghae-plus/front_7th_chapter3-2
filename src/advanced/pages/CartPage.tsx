/**
 * CartPage Component
 *
 * 전역 상태(atom)를 구독하여 쇼핑 페이지를 구성합니다.
 */

import { useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { filterProducts } from '../entities/product/utils';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';
import { useCoupon } from '../hooks/useCoupon';
import { useDebounce } from '../shared/hooks/useDebounce';
import { usePriceFormatter } from '../shared/hooks/usePriceFormatter';
import { searchTermAtom } from '../shared/store/atoms';
import { ProductList } from '../widgets/Product/ProductList';
import { Cart } from '../widgets/Cart/Cart';

const CartPage = () => {
  const { products } = useProduct();
  const {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    completeOrder,
    getRemainingStock,
    calculateItemTotal,
    totals
  } = useCart();
  const { coupons } = useCoupon();
  const formatPrice = usePriceFormatter();
  const searchTerm = useAtomValue(searchTermAtom);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredProducts = useMemo(
    () => filterProducts(products, debouncedSearchTerm),
    [products, debouncedSearchTerm]
  );

  const calculateCartTotal = useCallback(() => totals, [totals]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={filteredProducts}
          searchTerm={debouncedSearchTerm}
          onAddToCart={addToCart}
          formatPrice={formatPrice}
          getRemainingStock={getRemainingStock}
        />
      </div>

      <div className="lg:col-span-1">
        <Cart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          onRemoveFromCart={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onApplyCoupon={applyCoupon}
          onRemoveCoupon={removeCoupon}
          onCompleteOrder={completeOrder}
          calculateItemTotal={calculateItemTotal}
          calculateCartTotal={calculateCartTotal}
        />
      </div>
    </div>
  );
};

export default CartPage;
