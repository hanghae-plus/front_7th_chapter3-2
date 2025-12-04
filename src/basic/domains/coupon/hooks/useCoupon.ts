import { Coupon } from "../../../../types";
import { useLocalStorage } from "../../../shared/hooks/useLocalStorage";
import { initialCoupons } from "../constants/initialCoupons";

type AmountCouponInstance = {
  discountType: "amount";
  isApplicable?: undefined;
};

type PercentageCouponInstance = {
  discountType: "percentage";
  isApplicable: (totalPrice: number) => boolean;
};

type CouponItemInstance = Omit<Coupon, "discountType"> &
  (AmountCouponInstance | PercentageCouponInstance) & {
    delete: () => void;
  };

export type CouponsService = {
  list: CouponItemInstance[];

  has: (code: string) => boolean;
  getByCode: (code: string) => CouponItemInstance | undefined;
  addItem: (coupon: Coupon) => void;
};

export function useCoupons(): CouponsService {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const couponInstance: CouponItemInstance[] = coupons.map((coupon, idx) => {
    const instance = {
      ...coupon,
      delete: () => {
        setCoupons((prev) => prev.filter((_, i) => i !== idx));
      },
    } as CouponItemInstance;

    if (coupon.discountType === "percentage") {
      instance.isApplicable = (totalPrice: number) => totalPrice >= 10_000;
    }

    return instance;
  });

  const has = (code: string) => {
    return couponInstance.some((coupon) => coupon.code === code);
  };

  const getByCode = (code: string) => {
    return couponInstance.find((coupon) => coupon.code === code);
  };

  const addItem = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
  };

  return {
    list: couponInstance,
    
    has,
    getByCode,
    addItem,
  };
}
