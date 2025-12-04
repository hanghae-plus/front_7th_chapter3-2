import { PlusIcon } from '../../../shared/ui/Icons';

interface AddCouponCardProps {
  onClick: () => void;
}

export const AddCouponCard = ({ onClick }: AddCouponCardProps) => (
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
    <button
      onClick={onClick}
      className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
    >
      <PlusIcon size={32} />
      <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
    </button>
  </div>
);
