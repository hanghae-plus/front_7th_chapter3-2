import { ADMIN_TABS } from '@/constants/tabs';
import { Notification, useTab } from '@/shared/hooks';
import { AdminHeader } from '@/shared/ui';
import { clsx } from 'clsx';

export const AdminPage = ({
  goPage,
  addNotification,
}: {
  goPage: (id: string) => void;
  addNotification: (message: string, type: Notification['type']) => void;
}) => {
  const { activeTab, changeTab, ActiveComponent } = useTab<{
    addNotification: (message: string, type: Notification['type']) => void;
  }>(ADMIN_TABS, 'products');

  return (
    <>
      <AdminHeader goPage={goPage} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              관리자 대시보드
            </h1>
            <p className="text-gray-600 mt-1">
              상품과 쿠폰을 관리할 수 있습니다
            </p>
          </div>
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {ADMIN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => changeTab(tab.id)}
                  className={clsx(
                    'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab.id === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <ActiveComponent addNotification={addNotification} />
        </div>
      </main>
    </>
  );
};
