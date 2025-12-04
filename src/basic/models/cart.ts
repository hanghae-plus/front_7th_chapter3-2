import { CartItem, Coupon, Product } from '../../types';

/**
 * 장바구니 아이템에 적용 가능한 최대 할인율을 계산합니다.
 * 대량 구매 시 추가 5% 할인이 적용됩니다.
 */
export function getMaxApplicableDiscount(item: CartItem, cart: CartItem[]): number {
  const { discounts } = item.product;
  const { quantity } = item;
  
  // 상품 자체 할인율 계산
  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount 
      ? discount.rate 
      : maxDiscount;
  }, 0);
  
  // 대량 구매 보너스: 장바구니 내 10개 이상 구매 시 추가 5% 할인
  const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 최대 50% 할인
  }
  
  return baseDiscount;
}

/**
 * 개별 장바구니 아이템의 할인 적용 후 총액을 계산합니다.
 */
export function calculateItemTotal(item: CartItem, cart: CartItem[]): number {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);
  
  return Math.round(price * quantity * (1 - discount));
}

/**
 * 장바구니 전체의 할인 전/후 총액을 계산합니다.
 */
export function calculateCartTotal(
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
} {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount = Math.round(totalAfterDiscount * (1 - selectedCoupon.discountValue / 100));
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalBeforeDiscount - totalAfterDiscount)
  };
}

/**
 * 상품의 남은 재고를 계산합니다.
 */
export function getRemainingStock(product: Product, cart: CartItem[]): number {
  const cartItem = cart.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
}

/**
 * 장바구니에 상품을 추가하거나 수량을 증가시킵니다.
 */
export function addItemToCart(cart: CartItem[], product: Product): CartItem[] {
  const existingItem = cart.find(item => item.product.id === product.id);
  
  if (existingItem) {
    return cart.map(item =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  
  return [...cart, { product, quantity: 1 }];
}

/**
 * 장바구니에서 상품을 제거합니다.
 */
export function removeItemFromCart(cart: CartItem[], productId: string): CartItem[] {
  return cart.filter(item => item.product.id !== productId);
}

/**
 * 장바구니 아이템의 수량을 업데이트합니다.
 */
export function updateCartItemQuantity(
  cart: CartItem[],
  productId: string,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return removeItemFromCart(cart, productId);
  }
  
  return cart.map(item =>
    item.product.id === productId
      ? { ...item, quantity }
      : item
  );
}
