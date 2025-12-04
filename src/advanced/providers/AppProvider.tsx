import { ProductProvider } from '../entities/product';
import { CouponProvider } from '../entities/coupon';
import { CartProvider } from '../entities/cart';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProductProvider>
      <CouponProvider>
        <CartProvider>{children}</CartProvider>
      </CouponProvider>
    </ProductProvider>
  );
};
