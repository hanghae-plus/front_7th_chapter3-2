import { CartItem, Coupon } from "../../../../types";
import { CartItemListSection } from "./CartItemListSection/CartItemListSection";
import { CouponSection } from "./CouponSection/CouponSection";
import { PurchaseSection } from "./PurchaseSection/PurchaseSection";

type CartSectionProps = {
  cart: CartItem[];
  coupons: Coupon[];
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  selectedCoupon: Coupon | null;
  calculateItemTotal: (item: CartItem) => number;
  onDeleteFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
  onCompleteOrder: () => void;
};

export function CartSection({
  cart,
  coupons,
  totals,
  selectedCoupon,
  calculateItemTotal,
  onDeleteFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onRemoveCoupon,
  onCompleteOrder,
}: CartSectionProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <CartItemListSection
          cart={cart}
          calculateItemTotal={calculateItemTotal}
          onDeleteFromCart={onDeleteFromCart}
          onUpdateQuantity={onUpdateQuantity}
        />

        {cart.length > 0 && (
          <>
            <CouponSection
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              onApplyCoupon={onApplyCoupon}
              onRemoveCoupon={onRemoveCoupon}
            />
            <PurchaseSection
              totals={totals}
              onCompleteOrder={onCompleteOrder}
            />
          </>
        )}
      </div>
    </div>
  );
}
