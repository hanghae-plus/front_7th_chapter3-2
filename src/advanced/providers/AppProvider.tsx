import { ProductProvider } from './ProductProvider';
import { CouponProvider } from './CouponProvider';
import { CartProvider } from './CartProvider';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProductProvider>
      <CouponProvider>
        <CartProvider>{children}</CartProvider>
      </CouponProvider>
    </ProductProvider>
  );
};
