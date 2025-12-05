import { CouponViewModel } from '../model/coupon-view-model';
import { TrashIcon } from '../../../shared/ui/icons';
import { Button } from '../../../shared/ui/button';

interface CouponItemProps {
  coupon: CouponViewModel;
  onDeleteCoupon: () => void;
}

export function CouponItem({ coupon, onDeleteCoupon }: CouponItemProps) {
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
              {coupon.discountText}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={onDeleteCoupon}
          className="text-gray-400 hover:text-red-600"
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
}
