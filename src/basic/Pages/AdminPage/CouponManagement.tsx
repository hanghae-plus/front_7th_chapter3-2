import { type FC, useState } from "react";
import { useCoupons } from "../../hooks/useCoupons";
import Button from "../../components/_common/Button";
import { Coupon } from "../../../types";

interface IProps {}

const CouponManagement: FC<IProps> = () => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0,
  });

  const { coupons, addCoupon, deleteCoupon } = useCoupons();

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

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 font-mono">
                    {coupon.code}
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                      {coupon.discountType === "amount"
                        ? `${coupon.discountValue.toLocaleString()}원 할인`
                        : `${coupon.discountValue}% 할인`}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  color="danger"
                  size="sm"
                  onClick={() => deleteCoupon(coupon.code)}>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <Button
              variant="ghost"
              color="gray"
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="flex flex-col items-center">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </Button>
          </div>
        </div>

        {showCouponForm && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <form onSubmit={handleCouponSubmit} className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">
                새 쿠폰 생성
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    쿠폰명
                  </label>
                  <input
                    type="text"
                    value={couponForm.name}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, name: e.target.value })
                    }
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                    placeholder="신규 가입 쿠폰"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    쿠폰 코드
                  </label>
                  <input
                    type="text"
                    value={couponForm.code}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
                    placeholder="WELCOME2024"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    할인 타입
                  </label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        discountType: e.target.value as "amount" | "percentage",
                      })
                    }
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm">
                    <option value="amount">정액 할인</option>
                    <option value="percentage">정률 할인</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {couponForm.discountType === "amount"
                      ? "할인 금액"
                      : "할인율(%)"}
                  </label>
                  <input
                    type="text"
                    value={
                      couponForm.discountValue === 0
                        ? ""
                        : couponForm.discountValue
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d+$/.test(value)) {
                        setCouponForm({
                          ...couponForm,
                          discountValue: value === "" ? 0 : parseInt(value),
                        });
                      }
                    }}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                    placeholder={
                      couponForm.discountType === "amount" ? "5000" : "10"
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  color="gray"
                  onClick={() => setShowCouponForm(false)}>
                  취소
                </Button>
                <Button type="submit" variant="solid" color="indigo">
                  쿠폰 생성
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default CouponManagement;
