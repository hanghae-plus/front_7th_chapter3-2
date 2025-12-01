import { Coupon } from '../../../../types';
import { CouponCard } from '../coupon/CouponCard';
import { PlusIcon } from '../../icons';
import { CouponForm } from './CouponForm';
import { CouponFormData } from './types';

interface CouponManagementProps {
  coupons: Coupon[];
  couponForm: CouponFormData;
  showCouponForm: boolean;
  onAddCoupon: () => void;
  onDeleteCoupon: (couponCode: string) => void;
  onFormChange: (updates: Partial<CouponFormData>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onFormCancel: () => void;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}

// 쿠폰 관리 섹션 컴포넌트
export const CouponManagement = ({
  coupons,
  couponForm,
  showCouponForm,
  onAddCoupon,
  onDeleteCoupon,
  onFormChange,
  onFormSubmit,
  onFormCancel,
  addNotification
}: CouponManagementProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map(coupon => (
            <CouponCard
              key={coupon.code}
              coupon={coupon}
              onDelete={onDeleteCoupon}
              isAdmin={true}
            />
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={onAddCoupon}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <PlusIcon className="w-8 h-8" />
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            onFormChange={onFormChange}
            onSubmit={onFormSubmit}
            onCancel={onFormCancel}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
};

