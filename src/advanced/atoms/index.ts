// Cart atoms
export {
  cartAtom,
  totalItemCountAtom,
  getRemainingStockAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  completeOrderAtom
} from './cartAtoms';

// Product atoms
export {
  productsAtom,
  addProductAtom,
  updateProductAtom,
  deleteProductAtom,
  updateProductStockAtom,
  addProductDiscountAtom,
  removeProductDiscountAtom
} from './productAtoms';

// Coupon atoms
export {
  couponsAtom,
  addCouponAtom,
  deleteCouponAtom
} from './couponAtoms';

// UI atoms
export {
  isAdminAtom,
  searchTermAtom,
  debouncedSearchTermAtom
} from './uiAtoms';

// Notification atoms
export {
  notificationsAtom,
  addNotificationAtom,
  removeNotificationAtom
} from './notificationAtoms';

export type { Notification } from './notificationAtoms';

