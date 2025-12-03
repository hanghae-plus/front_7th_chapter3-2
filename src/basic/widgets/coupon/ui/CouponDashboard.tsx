import { IconPlus } from "../../../components/icons";
import { Coupon } from "../../../types";
import { CouponCard } from "../../../entities/coupon/ui/CouponCard";
import { CouponForm } from "../../../features/control-coupon-form/ui/CouponForm";

export function CouponDashboard({
  coupons,
  deleteCoupon,
  setShowCouponForm,
  showCouponForm,
  handleCouponSubmit,
  couponForm,
  setCouponForm,
  addNotification,
}: {
  coupons: Coupon[];
  deleteCoupon: (code: string) => void;
  setShowCouponForm: (show: boolean) => void;
  showCouponForm: boolean;
  handleCouponSubmit: (e: React.FormEvent) => void;
  couponForm: Coupon;
  setCouponForm: (coupon: Coupon) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}) {
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
              deleteCoupon={deleteCoupon}
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
            handleCouponSubmit={handleCouponSubmit}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            setShowCouponForm={setShowCouponForm}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
}
