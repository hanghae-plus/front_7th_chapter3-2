import React from "react";
import { Coupon } from "../../../../types";
import { Card } from "../../ui";
import { PlusIcon } from "../../icons";
import { CouponItem } from "./CouponItem";

interface CouponListProps {
  coupons: Coupon[];
  deleteCoupon: (code: string) => void;
  showCouponForm: boolean;
  setShowCouponForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CouponList = ({
  coupons,
  deleteCoupon,
  showCouponForm,
  setShowCouponForm,
}: CouponListProps) => {
  return (
    <Card>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponItem
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
              <PlusIcon className="w-8 h-8" />
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CouponList;
