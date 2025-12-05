import { IconCart } from "./icons";

export function CartCounter({ totalItemCount }: { totalItemCount: number }) {
  return (
    <div className="relative">
      <IconCart className="w-6 h-6 text-gray-700" />
      {totalItemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalItemCount}
        </span>
      )}
    </div>
  );
}
