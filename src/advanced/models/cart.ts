import { CartItem, Coupon, Product } from "../../types";
import { getMaxApplicableDiscount } from "./discount";

// 개별 아이템의 할인 적용 후 총액 계산
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item, cart);
    
    return Math.round(price * quantity * (1 - discount));
};

// 장바구니 총액 계산 (할인 전/후, 할인액)
export const calculateCartTotal = (cart: CartItem[], coupon: Coupon | null): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  if (coupon) {
    if (coupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - coupon.discountValue);
    } else {
      totalAfterDiscount = Math.round(totalAfterDiscount * (1 - coupon.discountValue / 100));
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount)
  };
};

// 수량 변경
// 장바구니에서 특정 상품의 수량만 변경을 책임
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  quantity: number
): CartItem[] => {
  // 수량 0 이하일때 배열에서 해당 아이템 제거
  if (quantity <= 0) {
    return cart.filter(item => item.product.id !== productId)
  }

  return cart.map(item => 
    item.product.id === productId
    ? { ...item, quantity: quantity}
    : item
  );
};

// 상품 추가
// 장바구니에 상품 추가에 대한 책임만 존재해야함 (재고 검증 X)
export const addItemToCart = (cart: CartItem[], product: Product) => {
  const existingItem = cart.find(item => item.product.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;

    return cart.map(item => 
      item.product.id === product.id
        ? { ...item, quantity: newQuantity }
        : item
    );
  }
  return [ ...cart, { product, quantity: 1 }];
};

// 상품 제거
export const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter(item => item.product.id !== productId);
};