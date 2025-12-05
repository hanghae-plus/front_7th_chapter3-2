import React, { ReactNode } from 'react';
import { ProductsProvider, CouponsProvider } from '../../contexts';

interface AdminPageProviderProps {
  children: ReactNode;
}

export const AdminPageProvider: React.FC<AdminPageProviderProps> = ({
  children,
}) => {
  return (
    <ProductsProvider>
      <CouponsProvider>{children}</CouponsProvider>
    </ProductsProvider>
  );
};
