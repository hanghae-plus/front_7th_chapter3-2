import { ProductWithUI } from "../../../lib/constants";
import { CartItem, Coupon } from "../../../../types";
import { ProductList } from "../../../domains/product/components/ProductList";
import { CartList } from "../../../domains/cart/components/CartList";
import { CartSummary } from "../../../domains/cart/components/CartSummary";
import { CartCheckout } from "../../../domains/cart/components/CartCheckout";
import { CouponSelector } from "../../../domains/coupon/components/CouponSelector";

interface HomePageProps {
  // Product
  filteredProducts: ProductWithUI[];
  cart: CartItem[];
  searchTerm: string;
  onAddToCart: (product: ProductWithUI) => void;

  // Cart
  calculateItemTotal: (item: CartItem) => number;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  onCheckout: () => void;

  // Coupon
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
  onClearCoupon: () => void;
}

export function HomePage({
  filteredProducts,
  cart,
  searchTerm,
  onAddToCart,
  calculateItemTotal,
  onRemoveFromCart,
  onUpdateQuantity,
  totalBeforeDiscount,
  totalAfterDiscount,
  onCheckout,
  coupons,
  selectedCoupon,
  onApplyCoupon,
  onClearCoupon,
}: HomePageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={filteredProducts}
          cart={cart}
          isAdmin={false}
          searchTerm={searchTerm}
          onAddToCart={onAddToCart}
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
            <CartList
              cart={cart}
              calculateItemTotal={calculateItemTotal}
              onRemove={onRemoveFromCart}
              onUpdateQuantity={onUpdateQuantity}
            />
          </section>

          {cart.length > 0 && (
            <>
              <CouponSelector
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onApplyCoupon={onApplyCoupon}
                onClearCoupon={onClearCoupon}
              />

              <section className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                <CartSummary
                  totalBeforeDiscount={totalBeforeDiscount}
                  totalAfterDiscount={totalAfterDiscount}
                />
                <CartCheckout
                  totalAfterDiscount={totalAfterDiscount}
                  onCheckout={onCheckout}
                />
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
