import React from 'react';

interface NumericStepperProps {
  /** 현재 값 */
  value: number;
  /** 값 변경 핸들러 */
  onChange: (value: number) => void;
  /** 최소값 */
  min?: number;
  /** 최대값 */
  max?: number;
  /** 증감 단위 */
  step?: number;
}

export const NumericStepper: React.FC<NumericStepperProps> = ({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
}) => {
  const handleDecrease = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleIncrease = () => {
    const newValue = value + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const isDecreaseDisabled = value <= min;
  const isIncreaseDisabled = max !== undefined && value >= max;

  return (
    <div className="flex items-center">
      <button
        onClick={handleDecrease}
        disabled={isDecreaseDisabled}
        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-xs">−</span>
      </button>
      <span className="mx-3 text-sm font-medium w-8 text-center">{value}</span>
      <button
        onClick={handleIncrease}
        disabled={isIncreaseDisabled}
        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-xs">+</span>
      </button>
    </div>
  );
};
