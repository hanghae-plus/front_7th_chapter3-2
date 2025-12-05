import { create } from "zustand";
import { createCartSlice, CartSlice } from "./cartSlice";
import { createCouponSlice, CouponSlice } from "./couponSlice";
import {
  createNotificationSlice,
  NotificationSlice,
} from "./notificationSlice";
import { createProductSlice, ProductSlice } from "./productSlice";

export type StoreState = CartSlice &
  CouponSlice &
  NotificationSlice &
  ProductSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createCartSlice(...a),
  ...createCouponSlice(...a),
  ...createNotificationSlice(...a),
  ...createProductSlice(...a),
}));
