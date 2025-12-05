import { PAGES } from '@/constants/pages';
import { Notification, useNotifications, usePage } from '@/shared/hooks';
import { Notifications, PageLayout } from '@/shared/ui';

const App = () => {
  const { PageComponent, goPage } = usePage<{
    goPage: (id: string) => void;
    addNotification: (message: string, type: Notification['type']) => void;
  }>(PAGES, 'products');

  const { notifications, addNotification, removeNotification } =
    useNotifications();

  return (
    <PageLayout>
      <Notifications
        notifications={notifications}
        removeNotification={removeNotification}
      />
      <PageComponent goPage={goPage} addNotification={addNotification} />
    </PageLayout>
  );
};

export default App;
