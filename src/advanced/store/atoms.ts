import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CartItem, Coupon, ProductWithUI, NotificationItem } from '../../types';

const initialProducts: ProductWithUI[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: '최고급 품질의 프리미엄 상품입니다.',
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: '다양한 기능을 갖춘 실용적인 상품입니다.',
    isRecommended: true,
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: '대용량과 고성능을 자랑하는 상품입니다.',
  },
];

const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

// localStorage와 동기화되는 atoms
export const productsAtom = atomWithStorage<ProductWithUI[]>('products', initialProducts);
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);

// 일반 atoms
export const selectedCouponAtom = atom<Coupon | null>(null);
export const isAdminAtom = atom(false);
export const searchTermAtom = atom('');

// Notification
export const notificationsAtom = atom<NotificationItem[]>([]);

// 테스트용: 모든 atom 초기화 함수
export const resetAllAtoms = () => {
  // 이 함수는 테스트에서 사용됩니다
  return {
    products: initialProducts,
    coupons: initialCoupons,
  };
};
