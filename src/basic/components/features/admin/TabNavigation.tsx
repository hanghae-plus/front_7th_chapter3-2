import { AdminTab } from './types';

interface TabNavigationProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

// 관리자 페이지 탭 네비게이션 컴포넌트
export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'products', label: '상품 관리' },
    { id: 'coupons', label: '쿠폰 관리' }
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

