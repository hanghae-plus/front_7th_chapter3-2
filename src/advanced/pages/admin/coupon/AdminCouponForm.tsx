import { useState } from "react";
import { Coupon } from "../../../../types";
import { Button } from "../../../components/common/ui/Button";
import { InputField } from "../../../components/common/ui/InputField";
import { addCoupon } from "../../../models/coupon";
import { extractNumbers } from "../../../utils/validators";

interface AdminCouponFormProps {
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  setShowCouponForm: (show: boolean) => void;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

interface CouponFormState {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

export const AdminCouponForm = ({
  coupons,
  setCoupons,
  setShowCouponForm,
  handleNotificationAdd,
}: AdminCouponFormProps) => {
  const [couponForm, setCouponForm] = useState<CouponFormState>({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0,
  });

  const handleCouponNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponForm({
      ...couponForm,
      name: e.target.value,
    });
  };

  const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 쿠폰 코드는 영문 대문자와 숫자만 허용
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setCouponForm({
      ...couponForm,
      code: value,
    });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const discountType = e.target.value as "amount" | "percentage";
    setCouponForm({
      ...couponForm,
      discountType,
      // 타입 변경 시 값 초기화 또는 범위 조정
      discountValue:
        discountType === "percentage" && couponForm.discountValue > 100
          ? 100
          : discountType === "amount" && couponForm.discountValue > 100000
          ? 100000
          : couponForm.discountValue || 0,
    });
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 입력 허용 (utils 함수 사용)
    const numbersOnly = extractNumbers(value);
    if (value === "" || numbersOnly === value) {
      setCouponForm({
        ...couponForm,
        discountValue: value === "" ? 0 : parseInt(value, 10),
      });
    }
  };

  const handleDiscountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    
    // 할인 타입별 범위 검증 (다른 필드 검증과 독립적으로 수행)
    if (couponForm.discountType === "percentage") {
      if (value > 100) {
        handleNotificationAdd("할인율은 100%를 초과할 수 없습니다", "error");
      }
    } else if (couponForm.discountType === "amount") {
      if (value > 100000) {
        handleNotificationAdd(
          "할인 금액은 100,000원을 초과할 수 없습니다",
          "error"
        );
      }
    }

    // 범위에 맞게 값 조정
    let adjustedValue = value;
    if (couponForm.discountType === "percentage") {
      adjustedValue = Math.max(0, Math.min(100, value));
    } else {
      adjustedValue = Math.max(0, Math.min(100000, value));
    }

    // 값이 변경된 경우 업데이트
    if (adjustedValue !== value) {
      setCouponForm({
        ...couponForm,
        discountValue: adjustedValue,
      });
    }
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 쿠폰 데이터 검증 및 추가
    const coupon: Coupon = {
      name: couponForm.name,
      code: couponForm.code,
      discountType: couponForm.discountType,
      discountValue: couponForm.discountValue,
    };

    const result = addCoupon(coupons, coupon);

    if (!result.success) {
      handleNotificationAdd(
        result.errorMessage || "쿠폰 추가에 실패했습니다.",
        "error"
      );
      return;
    }

    // 성공 시 상태 업데이트
    setCoupons(result.coupons);
    handleNotificationAdd("쿠폰이 추가되었습니다.", "success");

    // 폼 초기화
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleCouponSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InputField
            label="쿠폰명"
            type="text"
            value={couponForm.name || ""}
            onChange={handleCouponNameChange}
            placeholder="신규 가입 쿠폰"
            className="text-sm"
            required
          />
          <InputField
            label="쿠폰 코드"
            type="text"
            value={couponForm.code || ""}
            onChange={handleCouponCodeChange}
            placeholder="WELCOME2024"
            className="text-sm font-mono"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인 타입
            </label>
            <select
              value={couponForm.discountType || "amount"}
              onChange={handleTypeChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          <InputField
            label={
              couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"
            }
            type="text"
            value={
              couponForm.discountValue === 0 ? "" : couponForm.discountValue
            }
            onChange={handleDiscountChange}
            onBlur={handleDiscountBlur}
            placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
            className="text-sm"
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={() => setShowCouponForm(false)}
            variant="secondary"
            size="md"
          >
            취소
          </Button>
          <Button type="submit" variant="success" size="md">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
};
