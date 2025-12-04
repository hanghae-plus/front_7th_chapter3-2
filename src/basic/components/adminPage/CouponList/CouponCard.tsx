import { type FC } from "react";
import { Coupon } from "../../../../types";
import Button from "../../_common/Button";
import TrashIcon from "../../_icons/TrashIcon";
import { formatCouponDiscount } from "../../../models/coupon";

interface IProps {
  coupon: Coupon;
  onDelete: (couponCode: string) => void;
}

const CouponCard: FC<IProps> = ({ coupon, onDelete }) => {
  return (
    <div
      key={coupon.code}
      className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {formatCouponDiscount(coupon)}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          color="danger"
          size="sm"
          onClick={() => onDelete(coupon.code)}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
};

export default CouponCard;
