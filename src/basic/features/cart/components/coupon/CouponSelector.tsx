import { useCallback } from 'react';
import { Coupon } from '../../../../../types';
import { checkCouponAvailability } from '../../cart.service';
import { formatPrice } from '../../../../shared/utils/priceUtils';
import { useNotification } from '../../../notification/hooks/useNotification';
import { Select } from '../../../../shared/component/ui';

export const CouponSelector = ({
  selectedCoupon,
  setSelectedCoupon,
  coupons,
  cartTotalPrice,
  applyCoupon,
}: {
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  coupons: Coupon[];
  cartTotalPrice: { totalBeforeDiscount: number; totalAfterDiscount: number };
  applyCoupon: (
    coupon: Coupon,
    { onSuccess }: { onSuccess?: () => void },
  ) => void;
}) => {
  const { addNotification } = useNotification();

  const onCouponChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const coupon = coupons.find((c) => c.code === e.target.value);

      if (!coupon) return;

      const isCouponAvailable = checkCouponAvailability(
        coupon,
        cartTotalPrice.totalAfterDiscount,
      );

      if (!isCouponAvailable) {
        addNotification(
          'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
          'error',
        );
        setSelectedCoupon(null);
        return;
      }

      applyCoupon(coupon, {
        onSuccess: () => {
          addNotification('쿠폰이 적용되었습니다.', 'success');
        },
      });
    },
    [
      coupons,
      cartTotalPrice.totalAfterDiscount,
      addNotification,
      setSelectedCoupon,
      applyCoupon,
    ],
  );

  return (
    <Select
      value={selectedCoupon?.code || ''}
      onChange={onCouponChange}
      className="rounded focus:outline-none focus:border-blue-500 shadow-none focus:ring-0"
    >
      <option value="">쿠폰 선택</option>
      {coupons.map((coupon) => (
        <option key={coupon.code} value={coupon.code}>
          {coupon.name} (
          {coupon.discountType === 'amount'
            ? `${formatPrice(coupon.discountValue)}원`
            : `${coupon.discountValue}%`}
          )
        </option>
      ))}
    </Select>
  );
};
