import { CouponsTab } from '@/features/coupon';
import { ProductsTab } from '@/features/product';

export const ADMIN_TABS = [
  { id: 'products', label: '상품 관리', component: ProductsTab },
  { id: 'coupons', label: '쿠폰 관리', component: CouponsTab },
] as const;
