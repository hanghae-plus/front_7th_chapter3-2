import type { ToastMessage } from "../../utils/toast";
import { XIcon } from "../icons";

export const Toast = ({ notif, remove }: { notif: ToastMessage; remove: (id: string) => void }) => {
  const colors: Record<ToastMessage["type"], string> = {
    error: "bg-red-600",
    warning: "bg-yellow-600",
    success: "bg-green-600",
  };

  return (
    <div
      className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
        colors[notif.type]
      }`}
    >
      <span className='mr-2'>{notif.message}</span>
      <button onClick={() => remove(notif.id)} className='text-white hover:text-gray-200'>
        <XIcon className='w-4 h-4' />
      </button>
    </div>
  );
};
