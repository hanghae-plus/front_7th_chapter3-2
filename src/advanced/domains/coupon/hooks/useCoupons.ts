import { useStore } from "../../../shared/stores/store";

export function useCoupons() {
  const coupons = useStore((state) => state.coupons);
  const addCoupon = useStore((state) => state.addCoupon);
  const deleteCoupon = useStore((state) => state.deleteCoupon);

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
}
