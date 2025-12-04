import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { selectedCouponAtom } from "./couponAtoms";

import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  calculateCartTotal,
  getRemainingStock,
} from "../../models/cart";
import { toast } from "../../utils/toast";
import { canApplyPercentageCoupon } from "../../models/coupon";
import type { CartItem, Coupon } from "../../../types";
import type { ProductWithUI } from "./productAtoms";

const initialCart: CartItem[] = [];
export const cartAtom = atomWithStorage<CartItem[]>("cart", initialCart);

export const totalsAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});

export const addToCartAtom = atom(null, (get, set, product: ProductWithUI) => {
  const cart = get(cartAtom);
  const remaining = getRemainingStock(product, cart);

  if (remaining <= 0) {
    toast.error("재고가 부족합니다!");
    return;
  }

  set(cartAtom, addItemToCart(cart, product));
  toast.success("장바구니에 담았습니다");
});

export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  set(cartAtom, removeItemFromCart(get(cartAtom), productId));
});

export const updateQuantityAtom = atom(
  null,
  (get, set, { productId, newQuantity }: { productId: string; newQuantity: number }) => {
    const cart = get(cartAtom);
    const product = cart.find(({ product }) => product.id === productId)?.product;

    if (!product) return;

    if (newQuantity > product.stock) {
      toast.error(`재고는 ${product.stock}개까지만 있습니다.`);
      return;
    }

    set(cartAtom, updateCartItemQuantity(cart, productId, newQuantity));
  }
);

export const applyCouponAtom = atom(null, (get, set, coupon: Coupon) => {
  const cart = get(cartAtom);
  const currentTotal = calculateCartTotal(cart, coupon).totalAfterDiscount;

  if (coupon.discountType === "percentage" && !canApplyPercentageCoupon(currentTotal)) {
    toast.error("percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.");
    return;
  }

  set(selectedCouponAtom, coupon);
  toast.success("쿠폰이 적용되었습니다.");
});

export const completeOrderAtom = atom(null, (_, set) => {
  const orderNumber = `ORD-${Date.now()}`;
  toast.success(`주문이 완료되었습니다. 주문번호: ${orderNumber}`);
  set(cartAtom, []);
  set(selectedCouponAtom, null);
});
