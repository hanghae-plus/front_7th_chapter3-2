import { useCallback } from "react";
import { Discount } from "../../types";
import {
  addDiscount,
  removeDiscount,
  updateDiscount,
} from "../models/discount";

export const useDiscount = (
  discounts: Discount[],
  onChange: (newDiscounts: Discount[]) => void
) => {
  const add = useCallback(() => {
    onChange(addDiscount(discounts));
  }, [discounts, onChange]);

  const remove = useCallback(
    (index: number) => {
      onChange(removeDiscount(discounts, index));
    },
    [discounts, onChange]
  );

  const updateQuantity = useCallback(
    (index: number, quantity: number) => {
      onChange(updateDiscount(discounts, index, { quantity }));
    },
    [discounts, onChange]
  );

  const updateRate = useCallback(
    (index: number, rate: number) => {
      onChange(updateDiscount(discounts, index, { rate: rate / 100 }));
    },
    [discounts, onChange]
  );

  return { add, remove, updateQuantity, updateRate };
};
