import { Tabs } from '../../shared/ui/tabs';
import { ProductsSection } from './products-section';
import { CouponsSection } from './coupon-section';
import { ProductWithUI } from '../../entities/product';
import { Coupon } from '../../../types';
import { ToastProps } from '../../shared/ui/toast';
import { Layout } from '../../widgets/layout.ui';
import { AdminHeader } from '../../widgets/admin-header.ui';

interface PropsType {
  products: ProductWithUI[];
  coupons: Coupon[];
  onAddProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  onUpdateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  onDeleteProduct: (productId: string) => void;
  addCoupon: (newCoupon: Coupon) => void;
  removeCoupon: (couponCode: string) => void;
  onToggleAdmin: () => void;
  toast: (notification: ToastProps) => void;
}

export function AdminPage({
  products,
  coupons,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  addCoupon,
  removeCoupon,
  onToggleAdmin,
  toast,
}: PropsType) {
  return (
    <Layout header={<AdminHeader onToggleAdmin={onToggleAdmin} />}>
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
            <ProductsSection
              products={products}
              onAddProduct={onAddProduct}
              onUpdateProduct={onUpdateProduct}
              onDeleteProduct={onDeleteProduct}
              toast={toast}
            />
          </Tabs.Content>

          <Tabs.Content value="coupons" className="mt-0">
            <CouponsSection
              coupons={coupons}
              addCoupon={addCoupon}
              removeCoupon={removeCoupon}
              toast={toast}
            />
          </Tabs.Content>
        </Tabs>
      </div>
    </Layout>
  );
}
