import { Product } from '../../product/model/types';
import { getRemainingStock as getProductRemaining } from '../../product/lib';
import { CartItem } from '../model/types';

/**
 * 장바구니 현황을 고려한 상품의 남은 재고 계산
 */
export const getRemainingStockInCart = (
  product: Product,
  cart: CartItem[],
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;

  // Product Entity의 순수 계산기에게 위임
  return getProductRemaining(product, quantityInCart);
};
