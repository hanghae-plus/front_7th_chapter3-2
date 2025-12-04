import { useCouponStore } from '../../../entities/coupon/model/useCouponStore';
import CouponGrid from './CouponGrid';
import CouponForm from './CouponForm';

const CouponManagement = () => {
  const showCouponForm = useCouponStore((state) => state.showCouponForm);

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponGrid />

        {showCouponForm && <CouponForm />}
      </div>
    </section>
  );
};

export default CouponManagement;
