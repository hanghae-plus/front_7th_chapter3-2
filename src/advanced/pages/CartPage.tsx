import React, { useState, useMemo, useCallback } from 'react';
import { ProductWithUI } from '../hooks/useProducts';
import { Coupon } from '../../types';
import {
  ProductList,
  OrderSummary,
  CartSummary,
  CouponSelectorContainer,
} from '../components/cart';
import {
  calculateCartTotal,
  getRemainingStock,
  isCartEmpty,
} from '../models/cart';
import { filterProducts, isOutOfStock } from '../models/product';
import {
  useProductsContext,
  useCartContext,
  useNotificationsContext,
} from '../contexts';

interface CartPageProps {
  searchTerm: string;
}

export const CartPage: React.FC<CartPageProps> = ({ searchTerm }) => {
  const { products } = useProductsContext();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } =
    useCartContext();
  const { addNotification } = useNotificationsContext();

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const filteredProducts = useMemo(() => {
    return filterProducts({ products, searchTerm });
  }, [products, searchTerm]);

  const totals = useMemo(() => {
    return calculateCartTotal({ cart, selectedCoupon });
  }, [cart, selectedCoupon]);

  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock({ cart, product });

      if (isOutOfStock(remainingStock)) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);
      if (existingItem && existingItem.quantity + 1 > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
        return;
      }

      addToCart(product);
      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addToCart, addNotification]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      updateQuantity(productId, newQuantity);
    },
    [products, updateQuantity, addNotification]
  );

  const handleCompleteOrder = () => {
    clearCart();
    setSelectedCoupon(null);
    addNotification('주문이 완료되었습니다!', 'success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          searchTerm={searchTerm}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartSummary
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={removeFromCart}
          />

          {!isCartEmpty(cart) && (
            <>
              <CouponSelectorContainer
                selectedCoupon={selectedCoupon}
                onSelectCoupon={setSelectedCoupon}
              />

              <OrderSummary
                totalBeforeDiscount={totals.totalBeforeDiscount}
                totalAfterDiscount={totals.totalAfterDiscount}
                onCompleteOrder={handleCompleteOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
