import { useCallback, useState } from "react";
import { Coupon } from "../../types";
import { validateCouponDiscount, isNumericInput } from "../utils/validators";

type CouponFormData = {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

type Props = {
  addCoupon: (newCoupon: Coupon) => void;
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
};

export const useCouponForm = ({ addCoupon, addNotification }: Props) => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<CouponFormData>({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0,
  });

  const resetForm = useCallback(() => {
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  }, []);

  const startAddCoupon = useCallback(() => {
    resetForm();
    setShowCouponForm(true);
  }, [resetForm]);

  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addCoupon(couponForm);
      resetForm();
    },
    [couponForm, addCoupon, resetForm]
  );

  const handleDiscountValueChange = useCallback((value: string) => {
    if (isNumericInput(value)) {
      setCouponForm((prev) => ({ ...prev, discountValue: value === "" ? 0 : parseInt(value) }));
    }
  }, []);

  const handleDiscountValueBlur = useCallback(
    (value: string, discountType: "amount" | "percentage") => {
      const numValue = parseInt(value) || 0;
      const result = validateCouponDiscount(discountType, numValue);

      if (!result.isValid && result.correctedValue !== undefined) {
        if (result.errorMessage) {
          addNotification(result.errorMessage, "error");
        }
        setCouponForm((prev) => ({ ...prev, discountValue: result.correctedValue! }));
      }
    },
    [addNotification]
  );

  return {
    showCouponForm,
    setShowCouponForm,
    couponForm,
    setCouponForm,
    startAddCoupon,
    handleCouponSubmit,
    handleDiscountValueChange,
    handleDiscountValueBlur,
    resetForm,
  };
};
