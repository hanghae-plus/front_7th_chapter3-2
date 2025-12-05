import { PageItem } from '@/shared/hooks/usePage';
import { AdminPage } from '@/pages/AdminPage';
import { ProductsPage } from '@/pages/ProductsPage';

export const PAGES: PageItem[] = [
  { id: 'products', name: '상품 페이지', component: ProductsPage },
  { id: 'admin', name: '쿠폰 관리', component: AdminPage },
];
