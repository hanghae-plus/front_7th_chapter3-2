import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
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

export type CouponsContextValue = {
  list: CouponItemInstance[];
  has: (code: string) => boolean;
  getByCode: (code: string) => CouponItemInstance | undefined;
  addItem: (coupon: Coupon) => void;
};

const CouponsContext = createContext<CouponsContextValue | null>(null);

export function CouponsProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const couponInstance: CouponItemInstance[] = useMemo(
    () =>
      coupons.map((coupon, idx) => {
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
      }),
    [coupons, setCoupons]
  );

  const has = useCallback(
    (code: string) => {
      return couponInstance.some((coupon) => coupon.code === code);
    },
    [couponInstance]
  );

  const getByCode = useCallback(
    (code: string) => {
      return couponInstance.find((coupon) => coupon.code === code);
    },
    [couponInstance]
  );

  const addItem = useCallback(
    (coupon: Coupon) => {
      setCoupons((prev) => [...prev, coupon]);
    },
    [setCoupons]
  );

  const value: CouponsContextValue = useMemo(
    () => ({
      list: couponInstance,
      has,
      getByCode,
      addItem,
    }),
    [couponInstance, has, getByCode, addItem]
  );

  return (
    <CouponsContext.Provider value={value}>{children}</CouponsContext.Provider>
  );
}

export function useCoupons() {
  const context = useContext(CouponsContext);
  if (!context) {
    throw new Error("useCoupons must be used within CouponsProvider");
  }
  return context;
}

