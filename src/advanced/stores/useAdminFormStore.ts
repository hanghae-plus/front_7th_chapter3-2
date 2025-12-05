import { create } from 'zustand';
import { Discount } from '../../types';
import { ProductWithUI } from '../models/product';
import {
  DEFAULT_PRODUCT_FORM,
  DEFAULT_COUPON_FORM,
  MAX_STOCK_LIMIT,
  MAX_DISCOUNT_AMOUNT,
} from '../constants';
import { isNumericInput, parseNumberInput } from '../utils/validators';

interface ProductFormState {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Discount[];
}

interface CouponFormState {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

interface AdminFormState {
  // Tab
  activeTab: 'products' | 'coupons';
  setActiveTab: (tab: 'products' | 'coupons') => void;

  // Product Form
  showProductForm: boolean;
  editingProduct: string | null;
  productForm: ProductFormState;
  setShowProductForm: (show: boolean) => void;
  setEditingProduct: (id: string | null) => void;
  setProductForm: (form: ProductFormState) => void;
  updateProductFormField: <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K]
  ) => void;
  resetProductForm: () => void;
  startEditProduct: (product: ProductWithUI) => void;
  startAddProduct: () => void;

  // Product Form Field Handlers
  handleProductNameChange: (value: string) => void;
  handleProductDescriptionChange: (value: string) => void;
  handlePriceChange: (value: string) => void;
  handlePriceBlur: (
    value: string,
    onNotification: (message: string, type: 'error' | 'success' | 'warning') => void
  ) => void;
  handleStockChange: (value: string) => void;
  handleStockBlur: (
    value: string,
    onNotification: (message: string, type: 'error' | 'success' | 'warning') => void
  ) => void;
  handleDiscountsChange: (discounts: Discount[]) => void;

  // Coupon Form
  showCouponForm: boolean;
  couponForm: CouponFormState;
  setShowCouponForm: (show: boolean) => void;
  setCouponForm: (form: CouponFormState) => void;
  updateCouponFormField: <K extends keyof CouponFormState>(
    field: K,
    value: CouponFormState[K]
  ) => void;
  resetCouponForm: () => void;
  toggleCouponForm: () => void;

  // Coupon Form Field Handlers
  handleCouponNameChange: (value: string) => void;
  handleCouponCodeChange: (value: string) => void;
  handleCouponTypeChange: (value: 'amount' | 'percentage') => void;
  handleDiscountValueChange: (value: string) => void;
  handleDiscountValueBlur: (
    onNotification: (message: string, type: 'error' | 'success' | 'warning') => void
  ) => void;
}

export const useAdminFormStore = create<AdminFormState>((set, get) => ({
  // Tab
  activeTab: 'products',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Product Form State
  showProductForm: false,
  editingProduct: null,
  productForm: { ...DEFAULT_PRODUCT_FORM, discounts: [] },

  setShowProductForm: (show) => set({ showProductForm: show }),
  setEditingProduct: (id) => set({ editingProduct: id }),
  setProductForm: (form) => set({ productForm: form }),

  updateProductFormField: (field, value) =>
    set((state) => ({
      productForm: { ...state.productForm, [field]: value },
    })),

  resetProductForm: () =>
    set({
      editingProduct: null,
      productForm: { ...DEFAULT_PRODUCT_FORM, discounts: [] },
      showProductForm: false,
    }),

  startEditProduct: (product) =>
    set({
      editingProduct: product.id,
      productForm: {
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        discounts: product.discounts || [],
      },
      showProductForm: true,
    }),

  startAddProduct: () =>
    set({
      editingProduct: 'new',
      productForm: { ...DEFAULT_PRODUCT_FORM, discounts: [] },
      showProductForm: true,
    }),

  // Product Form Field Handlers
  handleProductNameChange: (value) =>
    set((state) => ({
      productForm: { ...state.productForm, name: value },
    })),

  handleProductDescriptionChange: (value) =>
    set((state) => ({
      productForm: { ...state.productForm, description: value },
    })),

  handlePriceChange: (value) => {
    if (isNumericInput(value)) {
      set((state) => ({
        productForm: {
          ...state.productForm,
          price: value === '' ? 0 : parseNumberInput(value),
        },
      }));
    }
  },

  handlePriceBlur: (value, onNotification) => {
    if (value === '') {
      set((state) => ({
        productForm: { ...state.productForm, price: 0 },
      }));
    } else if (parseNumberInput(value) < 0) {
      onNotification('가격은 0보다 커야 합니다', 'error');
      set((state) => ({
        productForm: { ...state.productForm, price: 0 },
      }));
    }
  },

  handleStockChange: (value) => {
    if (isNumericInput(value)) {
      set((state) => ({
        productForm: {
          ...state.productForm,
          stock: value === '' ? 0 : parseNumberInput(value),
        },
      }));
    }
  },

  handleStockBlur: (value, onNotification) => {
    const numValue = parseNumberInput(value);
    if (value === '') {
      set((state) => ({
        productForm: { ...state.productForm, stock: 0 },
      }));
    } else if (numValue < 0) {
      onNotification('재고는 0보다 커야 합니다', 'error');
      set((state) => ({
        productForm: { ...state.productForm, stock: 0 },
      }));
    } else if (numValue > MAX_STOCK_LIMIT) {
      onNotification('재고는 9999개를 초과할 수 없습니다', 'error');
      set((state) => ({
        productForm: { ...state.productForm, stock: MAX_STOCK_LIMIT },
      }));
    }
  },

  handleDiscountsChange: (discounts) =>
    set((state) => ({
      productForm: { ...state.productForm, discounts },
    })),

  // Coupon Form State
  showCouponForm: false,
  couponForm: { ...DEFAULT_COUPON_FORM },

  setShowCouponForm: (show) => set({ showCouponForm: show }),
  setCouponForm: (form) => set({ couponForm: form }),

  updateCouponFormField: (field, value) =>
    set((state) => ({
      couponForm: { ...state.couponForm, [field]: value },
    })),

  resetCouponForm: () =>
    set({
      couponForm: { ...DEFAULT_COUPON_FORM },
      showCouponForm: false,
    }),

  toggleCouponForm: () =>
    set((state) => ({ showCouponForm: !state.showCouponForm })),

  // Coupon Form Field Handlers
  handleCouponNameChange: (value) =>
    set((state) => ({
      couponForm: { ...state.couponForm, name: value },
    })),

  handleCouponCodeChange: (value) =>
    set((state) => ({
      couponForm: { ...state.couponForm, code: value.toUpperCase() },
    })),

  handleCouponTypeChange: (value) =>
    set((state) => ({
      couponForm: { ...state.couponForm, discountType: value },
    })),

  handleDiscountValueChange: (value) => {
    if (isNumericInput(value)) {
      set((state) => ({
        couponForm: {
          ...state.couponForm,
          discountValue: value === '' ? 0 : parseNumberInput(value),
        },
      }));
    }
  },

  handleDiscountValueBlur: (onNotification) => {
    const { couponForm } = get();
    const value = couponForm.discountValue;

    if (couponForm.discountType === 'percentage') {
      if (value > 100) {
        onNotification('할인율은 100%를 초과할 수 없습니다', 'error');
        set((state) => ({
          couponForm: { ...state.couponForm, discountValue: 100 },
        }));
      } else if (value < 0) {
        set((state) => ({
          couponForm: { ...state.couponForm, discountValue: 0 },
        }));
      }
    } else {
      if (value > MAX_DISCOUNT_AMOUNT) {
        onNotification('할인 금액은 100,000원을 초과할 수 없습니다', 'error');
        set((state) => ({
          couponForm: { ...state.couponForm, discountValue: MAX_DISCOUNT_AMOUNT },
        }));
      } else if (value < 0) {
        set((state) => ({
          couponForm: { ...state.couponForm, discountValue: 0 },
        }));
      }
    }
  },
}));
