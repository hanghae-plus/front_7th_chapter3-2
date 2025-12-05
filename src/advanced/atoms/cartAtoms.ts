import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CartItem, Product } from '../../types';

// Cart 상태
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

// 총 아이템 개수 (derived atom)
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

// 재고 확인 함수 atom
export const getRemainingStockAtom = atom(
  null,
  (get, _set, product: Product) => {
    const cart = get(cartAtom);
    const cartItem = cart.find(item => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  }
);

// 장바구니에 상품 추가
export const addToCartAtom = atom(
  null,
  (get, set, product: Product) => {
    const cart = get(cartAtom);
    const cartItem = cart.find(item => item.product.id === product.id);
    const remainingStock = product.stock - (cartItem?.quantity || 0);

    if (remainingStock <= 0) {
      return { success: false, error: '재고가 부족합니다!' };
    }

    if (cartItem) {
      const newQuantity = cartItem.quantity + 1;
      
      if (newQuantity > product.stock) {
        return { success: false, error: `재고는 ${product.stock}개까지만 있습니다.` };
      }

      set(cartAtom, cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      set(cartAtom, [...cart, { product, quantity: 1 }]);
    }
    
    return { success: true, message: '장바구니에 담았습니다' };
  }
);

// 장바구니에서 상품 제거
export const removeFromCartAtom = atom(
  null,
  (get, set, productId: string) => {
    const cart = get(cartAtom);
    set(cartAtom, cart.filter(item => item.product.id !== productId));
  }
);

// 수량 변경
export const updateQuantityAtom = atom(
  null,
  (get, set, { productId, newQuantity, products }: { productId: string; newQuantity: number; products: Product[] }) => {
    const cart = get(cartAtom);
    
    if (newQuantity <= 0) {
      set(cartAtom, cart.filter(item => item.product.id !== productId));
      return { success: true };
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      return { success: false, error: '상품을 찾을 수 없습니다.' };
    }

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      return { success: false, error: `재고는 ${maxStock}개까지만 있습니다.` };
    }

    set(cartAtom, cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));

    return { success: true };
  }
);

// 주문 완료 (순수 함수 - 주문번호는 외부에서 주입)
export const completeOrderAtom = atom(
  null,
  (_get, set, orderNumber: string) => {
    set(cartAtom, []);
    
    return { 
      success: true, 
      message: `주문이 완료되었습니다. 주문번호: ${orderNumber}` 
    };
  }
);

