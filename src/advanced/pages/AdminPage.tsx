import React, { useState } from 'react';
import { CouponManagement, ProductManagement } from '../components/admin';
import { Tabs } from '../components/primitives';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>(
    'products'
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="products">상품 관리</Tabs.Tab>
          <Tabs.Tab value="coupons">쿠폰 관리</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {activeTab === 'products' ? <ProductManagement /> : <CouponManagement />}
    </div>
  );
};
