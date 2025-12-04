import { type FC, useState } from "react";
import { useCoupons } from "../../hooks/useCoupons";
import { Coupon } from "../../../types";
import CouponList from "../../components/adminPage/CouponList";
import CouponForm from "../../components/adminPage/CouponForm";
import Section from "../../components/_common/Section";
import { useForm } from "../../utils/hooks/useForm";
import { formatCouponCode } from "../../utils/validators";
import { validateDiscountRate } from "../../models/validation";
import { useAddNotification } from "../../hooks/useNotification";

const INITIAL_COUPON: Coupon = {
  name: "",
  code: "",
  discountType: "amount",
  discountValue: 0,
};

const CouponManagement: FC = () => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const addNotification = useAddNotification();
  const {
    values: couponForm,
    handleChange,
    resetForm,
  } = useForm<Coupon>(INITIAL_COUPON);

  const { coupons, addCoupon, deleteCoupon } = useCoupons();

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    resetForm();
    setShowCouponForm(false);
  };

  return (
    <Section title="쿠폰 관리">
      <CouponList
        coupons={coupons}
        onAddClick={() => setShowCouponForm(true)}
        onDelete={deleteCoupon}
      />

      {showCouponForm && (
        <CouponForm
          couponForm={couponForm}
          onNameChange={(value) => handleChange("name", value)}
          onCodeChange={(value) =>
            handleChange("code", value, formatCouponCode)
          }
          onDiscountTypeChange={(value) => handleChange("discountType", value)}
          onDiscountValueChange={(value) => {
            if (value !== "" && !/^\d+$/.test(value)) {
              return;
            }

            const numValue = value === "" ? 0 : parseInt(value);

            if (couponForm.discountType === "percentage") {
              const error = validateDiscountRate(numValue);
              if (error) {
                addNotification(error, "error");
                return;
              }
            }

            handleChange("discountValue", numValue);
          }}
          onSubmit={handleCouponSubmit}
          onCancel={() => setShowCouponForm(false)}
        />
      )}
    </Section>
  );
};

export default CouponManagement;
