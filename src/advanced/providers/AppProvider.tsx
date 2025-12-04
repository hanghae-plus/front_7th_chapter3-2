import { ProductProvider } from '../entities/product';
import { CouponProvider } from '../entities/coupon';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProductProvider>
      <CouponProvider>{children}</CouponProvider>
    </ProductProvider>
  );
};
