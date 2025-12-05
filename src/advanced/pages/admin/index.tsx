import { Tab, TabList, TabPanel, Tabs } from '../../components/tabs';
import useTabs from '../../hooks/tabs';
import CouponSection from './components/coupon-section';
import ProductSection from './components/product-section';

const TABS = {
  products: 'products',
  coupons: 'coupons'
} as const;

const AdminPage = () => {
  const { activeTab, setActiveTab } = useTabs<keyof typeof TABS>(TABS.products);

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
        <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab value={TABS.products}>상품 관리</Tab>
          <Tab value={TABS.coupons}>쿠폰 관리</Tab>
        </TabList>
        <TabPanel value={TABS.products}>
          <ProductSection />
        </TabPanel>
        <TabPanel value={TABS.coupons}>
          <CouponSection />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default AdminPage;
