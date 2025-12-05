import { useStore } from "../stores/store";

export function useNotification() {
  const notifications = useStore((state) => state.notifications);
  const addNotification = useStore((state) => state.addNotification);
  const removeNotification = useStore((state) => state.removeNotification);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
