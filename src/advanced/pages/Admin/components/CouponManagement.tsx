import { useState, useCallback } from "react";
import { PlusIcon } from "../../../components/icons";
import { useCouponForm } from "../hooks/useCouponForm";
import { CouponForm } from "./CouponForm";
import { CouponCard } from "./CouponCard";
import { useCoupons } from "../../../hooks/useCoupons";
import { useAtomValue, useSetAtom } from "jotai";
import { selectedCouponAtom } from "../../../atoms";

type CouponManagementProps = {
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
};

export function CouponManagement({ addNotification }: CouponManagementProps) {
  const [showCouponForm, setShowCouponForm] = useState(false);

  // useCoupons hook에서 직접 가져오기
  const setSelectedCoupon = useSetAtom(selectedCouponAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);

  const coupons = useCoupons({
    onMessage: addNotification,
    onDeleteSelectedCoupon: useCallback(
      (deletedCode) => {
        if (selectedCoupon?.code === deletedCode) {
          setSelectedCoupon(null);
        }
      },
      [selectedCoupon, setSelectedCoupon]
    ),
  });

  const {
    couponForm,
    handleCouponSubmit,
    handleChange,
    handleNameChange,
    handleCodeChange,
    handleDiscountTypeChange,
    handleDiscountValueChange,
    handleDiscountValueBlur,
  } = useCouponForm({
    onAddCoupon: (newCoupon) => {
      coupons.add(newCoupon);
      setShowCouponForm(false);
    },
    addNotification,
  });

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.value.map((coupon) => (
            <CouponCard
              key={coupon.code}
              coupon={coupon}
              onRemove={coupons.remove}
            />
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <PlusIcon className="w-8 h-8" />
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            onSubmit={handleCouponSubmit}
            onCancel={() => setShowCouponForm(false)}
            onChange={handleChange}
            onNameChange={handleNameChange}
            onCodeChange={handleCodeChange}
            onDiscountTypeChange={handleDiscountTypeChange}
            onDiscountValueChange={handleDiscountValueChange}
            onDiscountValueBlur={handleDiscountValueBlur}
          />
        )}
      </div>
    </section>
  );
}
