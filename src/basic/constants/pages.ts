import { Notification, PageItem } from '@/shared/hooks';
import { AdminPage } from '@/pages/AdminPage';
import { ProductsPage } from '@/pages/ProductsPage';

type PageProps = {
  goPage: (id: string) => void;
  addNotification: (message: string, type: Notification['type']) => void;
};

export const PAGES: PageItem<PageProps>[] = [
  { id: 'products', name: '상품 페이지', component: ProductsPage },
  { id: 'admin', name: '쿠폰 관리', component: AdminPage },
];
