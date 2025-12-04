/**
 * usePriceFormatter Hook
 *
 * 공용 가격 포맷 함수 제공
 */

import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { cartAtom, isAdminAtom, productsAtom } from '../store/atoms';
import { formatPrice as formatPriceUtil } from '../utils/format';

export const usePriceFormatter = () => {
  const isAdmin = useAtomValue(isAdminAtom);
  const products = useAtomValue(productsAtom);
  const cart = useAtomValue(cartAtom);

  return useCallback(
    (price: number, productId?: string) => {
      const product = productId ? products.find(p => p.id === productId) : undefined;
      return formatPriceUtil(price, isAdmin, product, cart);
    },
    [cart, isAdmin, products]
  );
};
