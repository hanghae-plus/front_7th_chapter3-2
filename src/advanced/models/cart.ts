import { CartItem, Product, Coupon } from '../../types';
import { getMaxApplicableDiscount, applyDiscount } from './discount';
import { applyCouponDiscount } from './coupon';

/**
 * 개별 아이템의 할인 적용 후 총액 계산
 */
export const calculateItemTotal = ({
  item,
  cart,
}: {
  item: CartItem;
  cart: CartItem[];
}) => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount({ item, cart });

  return applyDiscount({ price: price * quantity, discountRate: discount });
};

/**
 * 장바구니에 상품 추가
 */
export const addItemToCart = ({
  cart,
  product,
}: {
  cart: CartItem[];
  product: Product;
}) => {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [...cart, { product, quantity: 1 }];
};

/**
 * 장바구니에서 상품 제거
 */
export const removeItemFromCart = ({
  cart,
  productId,
}: {
  cart: CartItem[];
  productId: string;
}) => {
  return cart.filter((item) => item.product.id !== productId);
};

/**
 * 장바구니 아이템 수량 변경
 */
export const updateCartItemQuantity = ({
  cart,
  productId,
  quantity,
}: {
  cart: CartItem[];
  productId: string;
  quantity: number;
}) => {
  if (quantity <= 0) {
    return removeItemFromCart({ cart, productId });
  }

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
};

/**
 * 남은 재고 계산
 */
export const getRemainingStock = ({
  product,
  cart,
}: {
  product: Product;
  cart: CartItem[];
}) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

/**
 * 장바구니가 비어있는지 확인
 */
export const isCartEmpty = (cart: CartItem[]) => {
  return cart.length === 0;
};

/**
 * 장바구니 총 아이템 수 계산
 */
export const getTotalItemCount = (cart: CartItem[]) => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * 장바구니 전체의 할인 전/후 총 금액을 계산
 */
export const calculateCartTotal = ({
  cart,
  selectedCoupon,
}: {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
}): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal({ item, cart });
  });

  if (selectedCoupon) {
    totalAfterDiscount = applyCouponDiscount({
      coupon: selectedCoupon,
      totalAmount: totalAfterDiscount,
    });
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};
