import { ProductProvider } from './ProductProvider';
import { CouponProvider } from './CouponProvider';
import { CartProvider } from './CartProvider';
import { NotificationProvider } from './NotificationProvider';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProductProvider>
      <CouponProvider>
        <CartProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </CartProvider>
      </CouponProvider>
    </ProductProvider>
  );
};
