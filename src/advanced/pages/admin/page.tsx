import { Tabs } from '../../shared/ui/tabs';
import { ProductsSection } from './ui/products-section';
import { CouponsSection } from './ui/coupon-section';
import { Layout } from '../../widgets/layout.ui';
import { AdminHeader } from '../../widgets/admin-header.ui';

export function AdminPage() {
  return (
    <Layout header={<AdminHeader />}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <Tabs.List className="mb-6">
            <Tabs.Trigger value="products">상품 관리</Tabs.Trigger>
            <Tabs.Trigger value="coupons">쿠폰 관리</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="products" className="mt-0">
            <ProductsSection />
          </Tabs.Content>

          <Tabs.Content value="coupons" className="mt-0">
            <CouponsSection />
          </Tabs.Content>
        </Tabs>
      </div>
    </Layout>
  );
}
