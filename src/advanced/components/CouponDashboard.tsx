import { useAtomValue, useSetAtom } from "jotai";
import { IconPlus } from "./icons";
import { Coupon } from "../types";
import { CouponCard } from "./CouponCard";
import { CouponForm } from "./CouponForm";
import { useState } from "react";
import { couponsAtom, addCouponAtom, deleteCouponAtom } from "../store";
import { useToast } from "../utils/hooks/useToast";

const getInitialCouponForm = (): Coupon => {
  return {
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0,
  };
};

export function CouponDashboard() {
  const coupons = useAtomValue(couponsAtom);
  const addCouponAction = useSetAtom(addCouponAtom);
  const deleteCouponAction = useSetAtom(deleteCouponAtom);
  const { notify } = useToast();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState(getInitialCouponForm());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingCoupon = coupons.find((c) => c.code === couponForm.code);
    if (existingCoupon) {
      notify("이미 존재하는 쿠폰 코드입니다.", "error");
      return;
    }
    addCouponAction(couponForm);
    notify("쿠폰이 추가되었습니다.", "success");
    setCouponForm(getInitialCouponForm());
    setShowCouponForm(false);
  };

  const handleDelete = (code: string) => {
    deleteCouponAction(code);
    notify("쿠폰이 삭제되었습니다.", "success");
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.code}
              coupon={coupon}
              onDelete={handleDelete}
            />
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <IconPlus className="w-8 h-8" />
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            onSubmit={handleSubmit}
            onChange={setCouponForm}
            onCancel={setShowCouponForm}
          />
        )}
      </div>
    </section>
  );
}
