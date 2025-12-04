import { useState } from "react";
import { CouponList, CouponForm } from "../coupon";

import type { Coupon } from "../../../types";

export const ManagementCoupon = ({
  coupons,
  addCoupon,
  deleteCoupon,
}: // selectedCoupon,
// setSelectedCoupon,
{
  coupons: Coupon[];
  addCoupon: (newCoupon: Omit<Coupon, "id">) => void;
  deleteCoupon: (couponCode: string) => void;
  // selectedCoupon: Coupon | null;
  // setSelectedCoupon: (coupon: Coupon | null) => void;
}) => {
  const [show, setShow] = useState(false);

  const [couponForm, setCouponForm] = useState<Omit<Coupon, "id">>(couponFormInit);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm(couponFormInit);
    setShow(false);
  };

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <CouponList
          coupons={coupons}
          deleteCoupon={deleteCoupon}
          setShow={setShow}
          // selectedCoupon={selectedCoupon}
          // setSelectedCoupon={setSelectedCoupon}
        />
        {show && (
          <CouponForm
            form={couponForm}
            setForm={setCouponForm}
            setShow={setShow}
            handleCouponSubmit={handleCouponSubmit}
          />
        )}
      </div>
    </section>
  );
};

const couponFormInit: Omit<Coupon, "id"> = {
  name: "",
  code: "",
  discountType: "amount",
  discountValue: 0,
};
