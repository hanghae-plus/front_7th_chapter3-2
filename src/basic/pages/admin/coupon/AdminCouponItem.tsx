import { Coupon } from "../../../../types";
import { IconDelete } from "../../../components/common/icons/IconDelete";
import { Button } from "../../../components/common/ui/Button";

interface AdminCouponItemProps {
  coupon: Coupon;
  selectedCoupon: Coupon | null;
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const AdminCouponItem = ({
  coupon,
  selectedCoupon,
  setCoupons,
  setSelectedCoupon,
  handleNotificationAdd,
}: AdminCouponItemProps) => {
  const deleteCoupon = (couponCode: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }
    handleNotificationAdd("쿠폰이 삭제되었습니다.", "success");
  };

  return (
    <div
      key={coupon.code}
      className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {coupon.discountType === "amount"
                ? `${coupon.discountValue.toLocaleString()}원 할인`
                : `${coupon.discountValue}% 할인`}
            </span>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => deleteCoupon(coupon.code)}
          variant="icon"
        >
          <IconDelete />
        </Button>
      </div>
    </div>
  );
};
