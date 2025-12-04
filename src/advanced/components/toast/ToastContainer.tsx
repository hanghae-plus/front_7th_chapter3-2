import { Toast } from "../ui/Toast";
import { useNotification } from "../../utils/hooks/useNotification";

export const ToastContainer = () => {
  const { notifications, remove } = useNotification();

  return (
    notifications.length > 0 && (
      <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
        {notifications.map((notif) => (
          <Toast key={notif.id} notif={notif} remove={remove} />
        ))}
      </div>
    )
  );
};
