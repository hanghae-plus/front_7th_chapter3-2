import { ProductList } from "../../../domains/product/components/ProductList";
import { CartList } from "../../../domains/cart/components/CartList";
import { CartSummary } from "../../../domains/cart/components/CartSummary";
import { CartCheckout } from "../../../domains/cart/components/CartCheckout";
import { CouponSelector } from "../../../domains/coupon/components/CouponSelector";
import { useProducts } from "../../../domains/product/hooks/useProducts";
import { useProductSearch } from "../../../domains/product/hooks/useProductSearch";
import { useCart } from "../../../domains/cart/hooks/useCart";
import { useCartCalculations } from "../../../domains/cart/hooks/useCartCalculations";
import { useCheckout } from "../../../domains/cart/hooks/useCheckout";
import { useCoupons } from "../../../domains/coupon/hooks/useCoupons";
import { useCouponApplication } from "../../../domains/coupon/hooks/useCouponApplication";

export function HomePage() {
  const { products } = useProducts();
  const { filteredProducts, searchTerm } = useProductSearch();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { calculateItemTotal, totals } = useCartCalculations();
  const { handleCheckout } = useCheckout();
  const { coupons } = useCoupons();
  const { selectedCoupon, handleApplyCoupon, clearCoupon } =
    useCouponApplication();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={filteredProducts}
          cart={cart}
          isAdmin={false}
          searchTerm={searchTerm}
          onAddToCart={addToCart}
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
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          </section>

          {cart.length > 0 && (
            <>
              <CouponSelector
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onApplyCoupon={(coupon) =>
                  handleApplyCoupon(coupon, totals.totalAfterDiscount)
                }
                onClearCoupon={clearCoupon}
              />

              <section className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                <CartSummary
                  totalBeforeDiscount={totals.totalBeforeDiscount}
                  totalAfterDiscount={totals.totalAfterDiscount}
                />
                <CartCheckout
                  totalAfterDiscount={totals.totalAfterDiscount}
                  onCheckout={handleCheckout}
                />
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
