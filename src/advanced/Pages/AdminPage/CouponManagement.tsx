import { type FC, useState } from "react";
import { useCoupons } from "../../hooks/useCoupons";
import { Coupon } from "../../../types";
import CouponList from "../../components/adminPage/CouponList";
import CouponForm from "../../components/adminPage/CouponForm";
import Section from "../../components/_common/Section";
import { useForm } from "../../utils/hooks/useForm";
import { formatCouponCode } from "../../utils/validators";
import { Notification } from "../../models/notificiation";
import { validateDiscountRate } from "../../models/validation";

const INITIAL_COUPON: Coupon = {
  name: "",
  code: "",
  discountType: "amount",
  discountValue: 0,
};

interface IProps {
  addNotification: (message: string, type: Notification["type"]) => void;
}
const CouponManagement: FC<IProps> = ({ addNotification }) => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const {
    values: couponForm,
    handleChange,
    resetForm,
  } = useForm<Coupon>(INITIAL_COUPON);

  const { coupons, addCoupon, deleteCoupon } = useCoupons(addNotification);

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
            // 빈 문자열이거나 순수 숫자가 아니면 무시
            if (value !== "" && !/^\d+$/.test(value)) {
              return; // 이전 값 유지
            }

            const numValue = value === "" ? 0 : parseInt(value);

            // 퍼센트 타입일 때만 검증
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
