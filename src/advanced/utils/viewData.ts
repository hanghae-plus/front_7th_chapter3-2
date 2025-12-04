import { CartItem, Coupon } from "../../types";
import { calculateItemTotal, calculateCartTotal } from "../models/cart";

/**
 * 장바구니 아이템의 뷰 데이터를 계산하는 순수 함수
 * (엔티티 데이터를 UI 표시용 데이터로 변환)
 * @param cart 장바구니 아이템 배열
 * @param item 계산할 장바구니 아이템
 * @returns 뷰 데이터 (할인 여부, 할인율 등)
 */
export interface CartItemViewData {
  itemTotal: number;
  originalPrice: number;
  hasDiscount: boolean;
  discountRate: number;
}

export const calculateCartItemViewData = (
  cart: CartItem[],
  item: CartItem
): CartItemViewData => {
  const itemTotal = calculateItemTotal(cart, item);
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount
    ? Math.round((1 - itemTotal / originalPrice) * 100)
    : 0;

  return {
    itemTotal,
    originalPrice,
    hasDiscount,
    discountRate,
  };
};

/**
 * 결제 정보의 뷰 데이터를 계산하는 순수 함수
 * @param cart 장바구니 아이템 배열
 * @param selectedCoupon 적용된 쿠폰
 * @returns 결제 정보 뷰 데이터
 */
export interface PaymentViewData {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  discountAmount: number;
  hasDiscount: boolean;
}

export const calculatePaymentViewData = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): PaymentViewData => {
  if (!cart || !Array.isArray(cart)) {
    return {
      totalBeforeDiscount: 0,
      totalAfterDiscount: 0,
      discountAmount: 0,
      hasDiscount: false,
    };
  }

  const totals = calculateCartTotal(cart, selectedCoupon);
  const discountAmount =
    totals.totalBeforeDiscount - totals.totalAfterDiscount;
  const hasDiscount = discountAmount > 0;

  return {
    totalBeforeDiscount: totals.totalBeforeDiscount,
    totalAfterDiscount: totals.totalAfterDiscount,
    discountAmount,
    hasDiscount,
  };
};

/**
 * 상품 목록의 뷰 데이터를 계산하는 순수 함수
 * @param products 상품 배열
 * @param cart 장바구니 아이템 배열
 * @returns 상품 목록 뷰 데이터
 */
export interface ProductListViewData {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
}

export const calculateProductListViewData = (
  products: Array<{ id: string; stock: number }>,
  cart: CartItem[]
): ProductListViewData => {
  if (!products || !Array.isArray(products)) {
    return {
      totalProducts: 0,
      inStockProducts: 0,
      outOfStockProducts: 0,
    };
  }

  const totalProducts = products.length;
  let inStockProducts = 0;
  let outOfStockProducts = 0;

  products.forEach((product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remainingStock = product.stock - (cartItem?.quantity || 0);
    
    if (remainingStock > 0) {
      inStockProducts++;
    } else {
      outOfStockProducts++;
    }
  });

  return {
    totalProducts,
    inStockProducts,
    outOfStockProducts,
  };
};

