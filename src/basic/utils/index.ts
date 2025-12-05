// Cart 관련 유틸리티 함수
export {
  calculateItemTotal,
  getMaxApplicableDiscount,
  calculateCartTotal,
  updateCartItemQuantity,
  getRemainingStock,
  addItemToCart,
  removeItemFromCart,
  getAppliedDiscountRate,
  type CartTotal
} from './cartUtils';

// Product 관련 유틸리티 함수
export {
  formatPrice,
  formatAdminPrice,
  getMaxDiscountRate,
  getMaxDiscountPercent
} from './productUtils';
