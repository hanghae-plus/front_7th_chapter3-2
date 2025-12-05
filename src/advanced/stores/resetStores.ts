import { useCartStore } from './useCartStore';
import { useProductStore } from './useProductStore';
import { useCouponStore } from './useCouponStore';
import { useAppStore } from './useAppStore';
import { useAdminFormStore } from './useAdminFormStore';
import { initialProducts, initialCoupons, DEFAULT_PRODUCT_FORM, DEFAULT_COUPON_FORM } from '../constants';

export const resetAllStores = () => {
  // Reset cart store
  useCartStore.setState({
    cart: [],
    selectedCoupon: null,
  });

  // Reset product store
  useProductStore.setState({
    products: initialProducts,
  });

  // Reset coupon store
  useCouponStore.setState({
    coupons: initialCoupons,
  });

  // Reset app store
  useAppStore.setState({
    isAdmin: false,
    searchTerm: '',
    notifications: [],
  });

  // Reset admin form store
  useAdminFormStore.setState({
    activeTab: 'products',
    showProductForm: false,
    editingProduct: null,
    productForm: { ...DEFAULT_PRODUCT_FORM, discounts: [] },
    showCouponForm: false,
    couponForm: { ...DEFAULT_COUPON_FORM },
  });
};
