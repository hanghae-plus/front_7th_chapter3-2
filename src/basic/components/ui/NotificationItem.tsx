// ui/NotificationItem.tsx
import { cva } from "class-variance-authority";
import { Notification } from "../../../types";

type NotificationItemProps = {
  variant: Notification["type"];
  message: string;
  onClose: () => void;
};

// ✓ CVA 구성
const notificationItemStyles = cva(
  "p-4 rounded-md shadow-md text-white flex justify-between items-center",
  {
    variants: {
      variant: {
        error: "bg-red-600",
        warning: "bg-yellow-600",
        success: "bg-green-600",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
);

export function NotificationItem({
  variant,
  message,
  onClose,
}: NotificationItemProps) {
  return (
    <div className={notificationItemStyles({ variant })}>
      <span className="mr-2">{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
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
  );
}
