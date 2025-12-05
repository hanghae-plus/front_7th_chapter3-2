import {
  CouponItem,
  mapCouponToViewModel,
  useCoupons,
} from '../../../entities/coupon';
import { useDeleteCoupon } from '../../../features/coupon/delete-coupon/use-delete-coupon';
import { PlusIcon } from '../../../shared/ui/icons';
import { Button } from '../../../shared/ui/button';

interface CouponListProps {
  onToggleShowCouponForm: () => void;
}

export function CouponList({ onToggleShowCouponForm }: CouponListProps) {
  const { coupons } = useCoupons();
  const { onDeleteCoupon } = useDeleteCoupon();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => {
        const viewModel = mapCouponToViewModel(coupon);

        return (
          <CouponItem
            key={coupon.code}
            coupon={viewModel}
            onDeleteCoupon={() => onDeleteCoupon(coupon.code)}
          />
        );
      })}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
        <Button
          variant="ghost"
          onClick={onToggleShowCouponForm}
          className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
        >
          <PlusIcon />
          <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
        </Button>
      </div>
    </div>
  );
}
