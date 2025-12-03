import React from 'react';
import { ProductList } from '../components/ProductList';
import { CartItemComponent } from '../components/ui/CartItemComponent';
import { CouponSelector } from '../components/ui/CouponSelector';
import { OrderSummary } from '../components/ui/OrderSummary';
import { ProductWithUI } from '../hooks/useProducts';
import { CartItem, Coupon } from '../../types';
import { calculateItemTotal } from '../models/cart';

interface ShoppingMallPageProps {
  products: ProductWithUI[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  searchTerm: string;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  formatPrice: (price: number, productId?: string) => string;
  onAddToCart: (product: ProductWithUI) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onSelectCoupon: (coupon: Coupon | null) => void;
  onCompleteOrder: () => void;
}

export const ShoppingMallPage: React.FC<ShoppingMallPageProps> = ({
  products,
  cart,
  coupons,
  selectedCoupon,
  searchTerm,
  totals,
  formatPrice,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onSelectCoupon,
  onCompleteOrder,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={products}
          cart={cart}
          isAdmin={false}
          formatPrice={formatPrice}
          onAddToCart={onAddToCart}
          searchTerm={searchTerm}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              장바구니
            </h2>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const itemTotal = calculateItemTotal({ item, cart });
                  const originalPrice = item.product.price * item.quantity;

                  return (
                    <CartItemComponent
                      key={item.product.id}
                      item={item}
                      itemTotal={itemTotal}
                      originalPrice={originalPrice}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemove={onRemoveFromCart}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {cart.length > 0 && (
            <>
              <CouponSelector
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onSelectCoupon={onSelectCoupon}
              />

              <OrderSummary
                totalBeforeDiscount={totals.totalBeforeDiscount}
                totalAfterDiscount={totals.totalAfterDiscount}
                onCompleteOrder={onCompleteOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
