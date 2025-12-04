import React from 'react';
import { Select, SelectOption } from '../primitives';

interface CouponSelectorViewProps {
  /** 쿠폰 옵션 리스트 (이미 포맷팅 완료) */
  couponOptions: SelectOption[];
  /** 선택된 쿠폰 코드 */
  selectedValue: string;
  /** 선택 변경 핸들러 */
  onChange: (value: string) => void;
  /** 쿠폰 등록 버튼 핸들러 (optional) */
  onRegisterClick?: () => void;
}

export const CouponSelectorView: React.FC<CouponSelectorViewProps> = ({
  couponOptions,
  selectedValue,
  onChange,
  onRegisterClick,
}) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        {onRegisterClick && (
          <button
            onClick={onRegisterClick}
            className="text-xs text-blue-600 hover:underline"
          >
            쿠폰 등록
          </button>
        )}
      </div>
      {couponOptions.length > 0 && (
        <Select
          options={couponOptions}
          placeholder="쿠폰 선택"
          value={selectedValue}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm"
        />
      )}
    </section>
  );
};
