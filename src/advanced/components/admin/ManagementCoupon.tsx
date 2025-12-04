import { useCallback, useState } from "react";
import { useSetAtom } from "jotai";
import { CouponList, CouponForm } from "../coupon";
import { addCouponAtom } from "../../stores/atoms/couponAtoms";

import type { FormEvent } from "react";
import type { Coupon } from "../../../types";

export const ManagementCoupon = () => {
  const [show, setShow] = useState(false);
  const [couponForm, setCouponForm] = useState<Omit<Coupon, "id">>(couponFormInit);

  const addCoupon = useSetAtom(addCouponAtom);

  const handleCouponSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      addCoupon(couponForm);
      setCouponForm(couponFormInit);
      setShow(false);
    },
    [couponForm, addCoupon, setCouponForm, setShow]
  );

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <CouponList setShow={setShow} />
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
