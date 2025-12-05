import { useCallback } from 'react';
import { Coupon } from '../../types';
import { ProductWithUI } from '../models/product';
import { useProductStore, useCouponStore, useCartStore, useAppStore } from '../stores';

import { ProductList } from '../components/product/ProductList';
import { EmptySearchResult } from '../components/product/EmptySearchResult';
import { filterProductsBySearchTerm } from '../models/product';
import {
  formatPriceWithSymbol,
  generateOrderNumber,
} from '../utils/formatters';
import { Cart } from '../components/cart/Cart';

interface CartPageProps {
  searchTerm: string;
}

export function CartPage({ searchTerm }: CartPageProps) {
  const { products } = useProductStore();
  const { coupons } = useCouponStore();
  const {
    cart,
    selectedCoupon,
    addToCart: addToCartStore,
    removeFromCart: removeFromCartStore,
    updateQuantity: updateQuantityStore,
    applyCoupon: applyCouponStore,
    clearCoupon,
    clearCart,
    calculateItemTotal,
    calculateCartTotal,
    getRemainingStock,
  } = useCartStore();
  const { addNotification } = useAppStore();

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }
    return formatPriceWithSymbol(price);
  };

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const result = addToCartStore(product);
      if (result.message) {
        addNotification(result.message, result.success ? 'success' : 'error');
      }
    },
    [addToCartStore, addNotification]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      removeFromCartStore(productId);
    },
    [removeFromCartStore]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const result = updateQuantityStore(productId, newQuantity, products);
      if (!result.success && result.message) {
        addNotification(result.message, 'error');
      }
    },
    [updateQuantityStore, products, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const result = applyCouponStore(coupon);
      if (result.message) {
        addNotification(result.message, result.success ? 'success' : 'error');
      }
    },
    [applyCouponStore, addNotification]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = generateOrderNumber();
    addNotification(
      '주문이 완료되었습니다. 주문번호: ' + orderNumber,
      'success'
    );
    clearCart();
  }, [addNotification, clearCart]);

  const totals = calculateCartTotal();
  const filteredProducts = filterProductsBySearchTerm(products, searchTerm);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">
              총 {products.length}개 상품
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <EmptySearchResult searchTerm={searchTerm} />
          ) : (
            <ProductList
              products={filteredProducts}
              getRemainingStock={getRemainingStock}
              formatPrice={formatPrice}
              onAddToCart={addToCart}
            />
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <Cart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          totals={totals}
          calculateItemTotal={calculateItemTotal}
          onRemoveFromCart={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onApplyCoupon={applyCoupon}
          onClearCoupon={clearCoupon}
          onCompleteOrder={completeOrder}
        />
      </div>
    </div>
  );
}
