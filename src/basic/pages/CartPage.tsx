import React, { useState, useMemo, useEffect } from 'react';
import { ProductWithUI } from '../hooks/useProducts';
import { CartItem, Coupon } from '../../types';
import {
  ProductList,
  OrderSummary,
  CartSummary,
  CouponSelectorContainer,
} from '../components/cart';
import { calculateCartTotal } from '../models/cart';

interface CartPageProps {
  products: ProductWithUI[];
  cart: CartItem[];
  coupons: Coupon[];
  searchTerm: string;
  formatPrice: (price: number, productId?: string) => string;
  onAddToCart: (product: ProductWithUI) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onAddNotification: (
    message: string,
    type: 'error' | 'success' | 'warning'
  ) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  products,
  cart,
  coupons,
  searchTerm,
  formatPrice,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onAddNotification,
}) => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 선택된 쿠폰이 삭제되면 선택 해제
  useEffect(() => {
    if (
      selectedCoupon &&
      !coupons.find((c) => c.code === selectedCoupon.code)
    ) {
      setSelectedCoupon(null);
    }
  }, [coupons, selectedCoupon]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  const totals = useMemo(() => {
    return calculateCartTotal({ cart, selectedCoupon });
  }, [cart, selectedCoupon]);

  const handleCompleteOrder = () => {
    onClearCart();
    setSelectedCoupon(null);
    onAddNotification('주문이 완료되었습니다!', 'success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={filteredProducts}
          cart={cart}
          isAdmin={false}
          formatPrice={formatPrice}
          onAddToCart={onAddToCart}
          searchTerm={searchTerm}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartSummary
            cart={cart}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveFromCart={onRemoveFromCart}
          />

          {cart.length > 0 && (
            <>
              <CouponSelectorContainer
                coupons={coupons}
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
