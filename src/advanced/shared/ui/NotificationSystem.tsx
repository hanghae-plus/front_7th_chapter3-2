// Global State
import { useNotificationStore } from "../lib/notificationStore";

// Model
import { Notification } from "../model/types";

// 알림 타입별 배경색 매핑
const NOTIFICATION_STYLES: Record<Notification["type"], string> = {
  error: "bg-red-600",
  warning: "bg-yellow-600",
  success: "bg-green-600",
};

/**
 * 전역 알림 메시지를 렌더링하는 순수 UI 컴포넌트 (Smart Component)
 * Zustand Store를 구독하여 알림 목록을 표시하고 닫기 이벤트를 처리합니다.
 */
export const NotificationSystem = () => {
  // Store 구독
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  // 알림이 없으면 렌더링하지 않음
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
            NOTIFICATION_STYLES[notif.type]
          }`}
        >
          <span className="mr-2">{notif.message}</span>
          <button
            onClick={() => removeNotification(notif.id)}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="알림 닫기"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};