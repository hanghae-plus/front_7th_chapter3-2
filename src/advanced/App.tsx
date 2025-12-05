import { Provider as JotaiProvider } from 'jotai';
import { PAGES } from '@/constants/pages';
import { Notifications } from '@/shared/ui';
import { PageLayout } from '@/shared/ui';
import {
  NotificationProvider,
  useNotification,
  PageProvider,
} from '@/shared/contexts';

const AppContent = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      <Notifications
        notifications={notifications}
        removeNotification={removeNotification}
      />
      <PageLayout />
    </>
  );
};

const App = () => {
  return (
    <JotaiProvider>
      <NotificationProvider>
        <PageProvider pages={PAGES} initialPageId="products">
          <AppContent />
        </PageProvider>
      </NotificationProvider>
    </JotaiProvider>
  );
};

export default App;
