import React, { ReactNode } from 'react';
import {
  ProductsProvider,
  CartProvider,
  CouponsProvider,
} from '../../contexts';

interface CartPageProviderProps {
  children: ReactNode;
}

export const CartPageProvider: React.FC<CartPageProviderProps> = ({
  children,
}) => {
  return (
    <ProductsProvider>
      <CartProvider>
        <CouponsProvider>{children}</CouponsProvider>
      </CartProvider>
    </ProductsProvider>
  );
};
