import { CloseIcon } from './common/Icons';

interface NotificationProps {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
  onClose: (id: string) => void;
}

export const Notification = ({ id, message, type, onClose }: NotificationProps) => {
  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
        type === 'error' ? 'bg-red-600' : type === 'warning' ? 'bg-yellow-600' : 'bg-green-600'
      }`}
    >
      <span className="mr-2">{message}</span>
      <button onClick={() => onClose(id)} className="text-white hover:text-gray-200">
        <CloseIcon />
      </button>
    </div>
  );
};
