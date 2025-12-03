import { useCouponStore } from '../../../entities/coupon/model/useCouponStore';
import { useNotificationStore } from '../../../shared/store/useNotificationStore';
import CouponGrid from './CouponGrid';
import CouponForm from './CouponForm';

const CouponManagement = () => {
  const {
    coupons,
    showCouponForm,
    couponForm,
    setShowCouponForm,
    setCouponForm,
    addCoupon,
    deleteCoupon,
    resetForm,
  } = useCouponStore();

  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = addCoupon(couponForm);
    if (success) {
      addNotification('쿠폰이 추가되었습니다.', 'success');
      resetForm();
    } else {
      addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
    }
  };

  const handleDelete = (couponCode: string) => {
    deleteCoupon(couponCode);
    addNotification('쿠폰이 삭제되었습니다.', 'success');
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponGrid
          coupons={coupons}
          onDelete={handleDelete}
          onAddClick={() => setShowCouponForm(!showCouponForm)}
        />

        {showCouponForm && (
          <CouponForm
            formData={couponForm}
            onSetFormData={setCouponForm}
            onSubmit={handleSubmit}
            onCancel={() => setShowCouponForm(false)}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
};

export default CouponManagement;
