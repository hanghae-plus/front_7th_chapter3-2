import { ReactNode } from 'react';
import { Coupon } from '../model/types';
import { getCouponLabel } from '../lib';
import { Badge } from '../../../shared/ui/Badge';

interface CouponCardProps {
  coupon: Coupon;
  action?: ReactNode;
}

export const CouponCard = ({ coupon, action }: CouponCardProps) => {
  const label = getCouponLabel(coupon);
  return (
    <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
          <div className="mt-2">
            <Badge variant="coupon">{label}</Badge>
          </div>
        </div>
        {action && <div className="ml-2">{action}</div>}
      </div>
    </div>
  );
};
