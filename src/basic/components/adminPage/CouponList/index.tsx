import { type FC } from "react";
import CouponCard from "./CouponCard";
import Button from "../../_common/Button";
import PlusIcon from "../../_icons/PlusIcon";
import { Coupon } from "../../../../types";

interface IProps {
  coupons: Coupon[];
  onAddClick: () => void;
  onDelete: (couponCode: string) => void;
}

const CouponList: FC<IProps> = ({ coupons, onAddClick, onDelete }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => (
        <CouponCard key={coupon.code} coupon={coupon} onDelete={onDelete} />
      ))}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
        <Button
          variant="ghost"
          color="gray"
          onClick={onAddClick}
          className="flex flex-col items-center">
          <PlusIcon />
          <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
        </Button>
      </div>
    </div>
  );
};

export default CouponList;
