import { ReactNode } from 'react';
import { CartItem as CartItemType } from '../model/types';
import { getItemTotal, getItemDiscountRate } from '../lib/item';
import { formatPrice } from '../../../shared/lib/formatters';

interface Props {
  item: CartItemType;
  control?: ReactNode; // (+ - 숫자) 통째로 들어옴
  action?: ReactNode; // (x) 삭제 버튼
}

export const CartItem = ({ item, control, action }: Props) => {
  const itemTotal = getItemTotal(item, []);
  const discountRate = getItemDiscountRate(item, []);

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <div className="ml-2">{action}</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {control ? (
            control
          ) : (
            <span className="text-sm font-medium text-gray-900">
              {item.quantity}개
            </span>
          )}
        </div>

        <div className="text-right">
          {discountRate > 0 && (
            <span className="text-xs text-red-500 font-medium block">
              -{Math.round(discountRate * 100)}%
            </span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {formatPrice(itemTotal)}원
          </p>
        </div>
      </div>
    </div>
  );
};
