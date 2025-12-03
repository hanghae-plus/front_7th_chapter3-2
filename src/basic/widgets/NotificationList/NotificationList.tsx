/**
 * NotificationList Widget
 * 
 * 책임: 알림 메시지 목록 표시
 * - 성공/에러/경고 메시지 표시
 * - 개별 알림 닫기 기능
 * - 자동 제거 (부모에서 타이머 관리)
 * 
 * 특징:
 * - UI만 담당 (상태 관리는 부모)
 * - 도메인 무관 (범용 알림 컴포넌트)
 */

import { Notification } from '../../../types';

interface NotificationListProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationList = ({ notifications, onRemove }: NotificationListProps) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`p-4 rounded-md shadow-md text-white flex justify-between items-center animate-slide-in ${
            notif.type === 'error' ? 'bg-red-600' : 
            notif.type === 'warning' ? 'bg-yellow-600' : 
            'bg-green-600'
          }`}
        >
          <span className="mr-2">{notif.message}</span>
          <button 
            onClick={() => onRemove(notif.id)}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="알림 닫기"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
