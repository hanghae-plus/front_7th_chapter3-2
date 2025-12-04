import { Coupon } from "../../../../types";
import { IconAdd } from "../../../components/common/icons/IconAdd";
import { CouponItem } from "../../../components/entity";
import { Button } from "../../../components/common/ui/Button";

interface AdminCouponListProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  showCouponForm: boolean;
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  setShowCouponForm: (show: boolean) => void;
}

export const AdminCouponList = ({
  coupons,
  selectedCoupon,
  showCouponForm,
  setCoupons,
  setSelectedCoupon,
  handleNotificationAdd,
  setShowCouponForm,
}: AdminCouponListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => (
        <CouponItem
          key={coupon.code}
          coupon={coupon}
          setCoupons={setCoupons}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          handleNotificationAdd={handleNotificationAdd}
        />
      ))}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
        <Button
          type="button"
          onClick={() => setShowCouponForm(!showCouponForm)}
          variant="text"
          className="flex flex-col items-center"
        >
          <IconAdd />
          <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
        </Button>
      </div>
    </div>
  );
};
