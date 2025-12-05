// Discount - 할인 관련 순수 계산 함수
export {
  hasBulkPurchase,
  getMaxDiscountRate,
  getMaxDiscountPercent,
  getMaxApplicableDiscount,
  calculateDiscountedPrice,
  getAppliedDiscountRate
} from './discount';

// Coupon - 쿠폰 관련 순수 계산 함수
export {
  applyCouponDiscount,
  getCouponDiscountAmount,
  findCouponByCode,
  formatCouponDiscount
} from './coupon';

// Cart - 장바구니 관련 순수 계산 함수
export {
  calculateItemTotal,
  calculateCartTotal,
  updateCartItemQuantity,
  addItemToCart,
  removeItemFromCart,
  type CartTotal
} from './cart';

// Product - 상품 관련 순수 계산 함수
export {
  getRemainingStock,
  isOutOfStock,
  sortByStock
} from './product';
