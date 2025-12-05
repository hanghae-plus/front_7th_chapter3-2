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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
