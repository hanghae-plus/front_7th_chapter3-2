/**
 * Jotai Atoms
 *
 * 전역 상태 관리를 위한 atom 모음
 */

// Product atoms
export {
  productsAtom,
  addProductAtom,
  updateProductAtom,
  deleteProductAtom
} from './productAtoms';

// Coupon atoms
export {
  couponsAtom,
  selectedCouponAtom,
  applyCouponAtom,
  removeCouponAtom,
  addCouponAtom,
  deleteCouponAtom
} from './couponAtoms';

// Cart atoms
export {
  cartAtom,
  cartTotalAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  clearCartAtom,
  getRemainingStock,
  getItemTotal
} from './cartAtoms';

// Notification atoms
export {
  notificationsAtom,
  addNotificationAtom,
  removeNotificationAtom,
  type Notification
} from './notificationAtoms';
