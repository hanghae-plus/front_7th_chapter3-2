import { atom } from "jotai";

// 공통 상태 atoms
export const searchTermAtom = atom<string>("");
export const isAdminAtom = atom<boolean>(false);

// Cart atoms
export {
  cartAtom,
  totalItemCountAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
} from "./cart";

// Product atoms
export {
  productsAtom,
  addProductAtom,
  updateProductAtom,
  deleteProductAtom,
} from "./product";

// Coupon atoms
export {
  couponsAtom,
  selectedCouponAtom,
  addCouponAtom,
  deleteCouponAtom,
  applyCouponAtom,
} from "./coupon";

// Purchase action (cart와 coupon을 함께 사용)
import { cartAtom } from "./cart";
import { selectedCouponAtom } from "./coupon";

export const purchaseAtom = atom(null, (_get, set) => {
  set(cartAtom, []);
  set(selectedCouponAtom, null);
});
