import { useState, useCallback } from "react";
import { Coupon } from "../../../../types";
import { useCoupons } from "../../../domains/coupon/contexts/CouponsContext";
import { useCart } from "../../../domains/cart/contexts/CartContext";
import { addNotification } from "../../../domains/notifications/utils/addNotification";
import { CouponList } from "./CouponList/CouponList";
import { CouponForm } from "./CouponForm/CouponForm";

export function CouponsSection() {
  const coupons = useCoupons();
  const cart = useCart();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      if (coupons.has(newCoupon.code)) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }

      coupons.addItem(newCoupon);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      coupons.getByCode(couponCode)?.delete();
      if (cart.selectedCoupon?.code === couponCode) {
        cart.clearCoupon();
      }
      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [coupons, cart]
  );

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const handleFormCancel = () => {
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const couponItems = coupons.list.map((coupon) => ({
    code: coupon.code,
    name: coupon.name,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    onDelete: () => deleteCoupon(coupon.code),
  }));

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponList
          coupons={couponItems}
          onAddClick={() => setShowCouponForm(!showCouponForm)}
        />

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            onFormChange={(updates) =>
              setCouponForm((prev) => ({ ...prev, ...updates }))
            }
            onSubmit={handleCouponSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </section>
  );
}

