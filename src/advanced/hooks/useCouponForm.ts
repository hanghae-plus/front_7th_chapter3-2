import { useState } from "react";
import { Coupon } from "../types/types";

interface CouponFormData {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

interface useCouponFormProps {
  setShowCouponForm: React.Dispatch<React.SetStateAction<boolean>>;
  addCoupon: (newCoupon: Coupon) => void;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export const useCouponForm = ({
  setShowCouponForm,
  addCoupon,
  addNotification,
}: useCouponFormProps) => {
  const [couponForm, setCouponForm] = useState<CouponFormData>({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });
  //

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

  const handleCouponName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponForm({
      ...couponForm,
      name: e.target.value,
    });
  };

  const handleCouponCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponForm({
      ...couponForm,
      code: e.target.value.toUpperCase(),
    });
  };

  const handleDiscountType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCouponForm({
      ...couponForm,
      discountType: e.target.value as "amount" | "percentage",
    });
  };

  const handleDiscountValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCouponForm({
        ...couponForm,
        discountValue: value === "" ? 0 : parseInt(value),
      });
    }
  };

  const handleDiscountBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (couponForm.discountType === "percentage") {
      if (value > 100) {
        addNotification("할인율은 100%를 초과할 수 없습니다", "error");
        setCouponForm({
          ...couponForm,
          discountValue: 100,
        });
      } else if (value < 0) {
        setCouponForm({
          ...couponForm,
          discountValue: 0,
        });
      }
    } else {
      if (value > 100000) {
        addNotification("할인 금액은 100,000원을 초과할 수 없습니다", "error");
        setCouponForm({
          ...couponForm,
          discountValue: 100000,
        });
      } else if (value < 0) {
        setCouponForm({
          ...couponForm,
          discountValue: 0,
        });
      }
    }
  };

  return {
    couponForm,
    handleCouponSubmit,
    handleCouponName,
    handleCouponCode,
    handleDiscountType,
    handleDiscountValue,
    handleDiscountBlur,
  };
};
