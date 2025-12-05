import { Notification, TabItem } from '@/shared/hooks';
import { CouponsTab } from '@/features/coupon';
import { ProductsTab } from '@/features/product';

type TabProps = {
  addNotification: (message: string, type: Notification['type']) => void;
};

export const ADMIN_TABS: TabItem<TabProps>[] = [
  { id: 'products', label: '상품 관리', component: ProductsTab },
  { id: 'coupons', label: '쿠폰 관리', component: CouponsTab },
];
