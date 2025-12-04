import { AdminCouponForm } from "./AdminCouponForm";
import { AdminCouponList } from "./AdminCouponList";
import { useAtoms } from "../../../hooks/useAtoms";

export const AdminCoupon = () => {
  const { showCouponForm } = useAtoms();

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <AdminCouponList />

        {showCouponForm && <AdminCouponForm />}
      </div>
    </section>
  );
};
