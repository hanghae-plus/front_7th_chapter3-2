import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../../types';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import { CART_STORAGE_KEY } from './cart-constants.config';
import { ToastProps } from '../../shared/ui/toast';
import { ProductWithUI } from '../product';

interface UseCartProps {
  toast: (notification: ToastProps) => void;
}

const getMaxApplicableDiscount = (cart: CartItem[], item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
};

const calculateItemTotal = (cart: CartItem[], item: CartItem): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(cart, item);

  return Math.round(price * quantity * (1 - discount));
};

export const calculateTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(cart, item);
  });

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

export function useCart({ toast }: UseCartProps) {
  const [cart, setCart] = useLocalStorage<CartItem[]>(CART_STORAGE_KEY, []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const getRemainingStock = (product: Product): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    return remaining;
  };

  /** 상품 추가 */
  const addToCart = (product: ProductWithUI) => {
    const remainingStock = getRemainingStock(product);

    if (remainingStock <= 0) {
      toast({
        message: '재고가 부족합니다!',
        type: 'error',
      });
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;

        if (newQuantity > product.stock) {
          toast({
            message: `재고는 ${product.stock}개까지만 있습니다.`,
            type: 'error',
          });
          return prevCart;
        }

        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return [...prevCart, { product, quantity: 1 }];
    });

    toast({
      message: '장바구니에 담았습니다',
      type: 'success',
    });
  };

  /** 상품 삭제 */
  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );

    toast({
      message: '장바구니에서 제거되었습니다',
      type: 'success',
    });
  };

  /** 수량 변경 */
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  /** 쿠폰 적용 */
  const applyCoupon = (coupon: Coupon) => {
    const currentTotal = calculateTotal(
      cart,
      selectedCoupon
    ).totalAfterDiscount;

    if (currentTotal < 10000 && coupon.discountType === 'percentage') {
      toast({
        message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
        type: 'error',
      });
    }

    console.log('coupon', coupon);
    setSelectedCoupon(coupon);

    toast({
      message: '쿠폰이 적용되었습니다.',
      type: 'success',
    });
  };

  /** 장바구니 비우기 */
  const clearCart = () => {
    const orderNumber = `ORD-${Date.now()}`;

    setCart([]);
    setSelectedCoupon(null);

    toast({
      message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      type: 'success',
    });
  };

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getRemainingStock,
    clearCart,
  };
}
