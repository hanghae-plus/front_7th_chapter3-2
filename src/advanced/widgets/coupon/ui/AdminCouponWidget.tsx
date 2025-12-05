import { useState } from 'react';
import { useCouponList } from '../../../entities/coupon/model/useCouponList';
import { useToast } from '../../../shared/hooks/useToast';
import { CouponCard } from '../../../entities/coupon/ui/CouponCard';
import { AddCouponCard } from '../../../entities/coupon/ui/AddCouponCard';
import { CouponForm } from '../../../features/coupon/ui/CouponForm';
import { Button } from '../../../shared/ui/Button';
import { TrashIcon } from '../../../shared/ui/Icons';

export const AdminCouponWidget = () => {
  const { coupons, deleteCoupon } = useCouponList();
  const { addToast } = useToast();

  const [showForm, setShowForm] = useState(false);

  const handleDeleteClick = (couponCode: string) => {
    deleteCoupon(couponCode);
    addToast('쿠폰이 삭제되었습니다.', 'success');
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>

      {/* 쿠폰 그리드 */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 쿠폰 카드들 */}
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.code}
              coupon={coupon}
              action={
                <Button
                  variant="delete"
                  onClick={() => handleDeleteClick(coupon.code)}
                  aria-label="쿠폰 삭제"
                >
                  <TrashIcon />
                </Button>
              }
            />
          ))}

          {/* 새 쿠폰 추가 카드 */}
          <AddCouponCard onClick={() => setShowForm(!showForm)} />
        </div>

        {/* 쿠폰 폼 */}
        {showForm && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <CouponForm onClose={handleFormClose} />
          </div>
        )}
      </div>
    </section>
  );
};
