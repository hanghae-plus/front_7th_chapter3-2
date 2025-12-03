import { FilledCartItem } from "../../domain/cart/cartTypes";
import { Coupon } from "../../../types";

import { formatCouponName } from "../../domain/cart/couponUtils";
import { CartList } from "./CartList";
import { CouponSection } from "./CouponSection";
import { PaymentSummary } from "./PaymentSummary";

interface CartSidebarProps {
  filledItems: FilledCartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  coupons: Coupon[];
  selectedCouponCode: string;
  selectorOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  totals: { totalBeforeDiscount: number; totalAfterDiscount: number };
  completeOrder: () => void;
}

export const CartSidebar = ({
  filledItems,
  removeFromCart,
  updateQuantity,
  coupons,
  selectedCouponCode,
  selectorOnChange,
  totals,
  completeOrder,
}: CartSidebarProps) => {
  return (
    <div className="sticky top-24 space-y-4">
      <CartList
        cart={filledItems}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />
      {filledItems.length > 0 && (
        <>
          <CouponSection
            coupons={formatCouponName(coupons)}
            showSelector={coupons.length > 0}
            selectedCouponCode={selectedCouponCode}
            selectorOnChange={selectorOnChange}
          />

          <PaymentSummary
            totalBeforeDiscount={totals.totalBeforeDiscount}
            totalAfterDiscount={totals.totalAfterDiscount}
            completeOrder={completeOrder}
          />
        </>
      )}
    </div>
  );
};
