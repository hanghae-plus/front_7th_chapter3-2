import { TrashIcon } from "../icons";

interface CardProps {
  cardId: string;
  title: string;
  subTitle: string;
  tagName: string;
  onClick: (cardId: string) => void;
}

export const Card = ({
  cardId,
  title,
  subTitle,
  tagName,
  onClick,
}: CardProps) => {
  return (
    <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{subTitle}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {tagName}
            </span>
          </div>
        </div>
        <button
          onClick={() => onClick(cardId)}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
