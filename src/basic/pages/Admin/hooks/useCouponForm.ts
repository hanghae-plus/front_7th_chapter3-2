import { useState } from "react";
import { Coupon } from "../../../../types";

interface UseCouponFormProps {
  onAddCoupon: (newCoupon: Coupon) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const useCouponForm = ({
  onAddCoupon,
  addNotification,
}: UseCouponFormProps) => {
  const [couponForm, setCouponForm] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0,
  });

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCoupon(couponForm);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCouponForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponForm((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }));
  };

  const handleDiscountTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCouponForm((prev) => ({
      ...prev,
      discountType: e.target.value as "amount" | "percentage",
    }));
  };

  const handleDiscountValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCouponForm((prev) => ({
        ...prev,
        discountValue: value === "" ? 0 : parseInt(value),
      }));
    }
  };

  const handleDiscountValueBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (couponForm.discountType === "percentage") {
      if (value > 100) {
        addNotification("할인율은 100%를 초과할 수 없습니다", "error");
        setCouponForm((prev) => ({ ...prev, discountValue: 100 }));
      } else if (value < 0) {
        setCouponForm((prev) => ({ ...prev, discountValue: 0 }));
      }
    } else {
      if (value > 100000) {
        addNotification("할인 금액은 100,000원을 초과할 수 없습니다", "error");
        setCouponForm((prev) => ({ ...prev, discountValue: 100000 }));
      } else if (value < 0) {
        setCouponForm((prev) => ({ ...prev, discountValue: 0 }));
      }
    }
  };

  return {
    couponForm,
    handleCouponSubmit,
    handleChange,
    handleNameChange,
    handleCodeChange,
    handleDiscountTypeChange,
    handleDiscountValueChange,
    handleDiscountValueBlur,
  };
};
