interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export const QuantityControl = ({
  quantity,
  onIncrease,
  onDecrease,
}: QuantityControlProps) => {
  return (
    <div className="flex items-center">
      <button
        onClick={onDecrease}
        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
      >
        <span className="text-xs">−</span>
      </button>
      <span className="mx-3 text-sm font-medium w-8 text-center">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
      >
        <span className="text-xs">+</span>
      </button>
    </div>
  );
};
