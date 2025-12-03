import { Coupon } from "../../../types";

interface CouponListProps {
  coupons: Coupon[];
  onDelete: (code: string) => void;
}

export const CouponList: React.FC<CouponListProps> = ({ coupons, onDelete }) => {
  if (coupons.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        등록된 쿠폰이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {coupons.map((coupon) => (
        <div
          key={coupon.code}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-indigo-700 border border-indigo-200">
                {coupon.discountType === "amount"
                  ? `${coupon.discountValue.toLocaleString()}원 할인`
                  : `${coupon.discountValue}% 할인`}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600 font-mono">{coupon.code}</p>
          </div>
          <button
            onClick={() => onDelete(coupon.code)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="쿠폰 삭제"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

