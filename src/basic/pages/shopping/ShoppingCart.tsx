import { CartItem as CartItemType, Coupon, ProductWithUI } from "../../../types";
import { IconCartSymbol } from "../../components/common/icons/IconCartSymbol";
import { CartItem } from "../../components/entity";
import { ShoppingCouponPayment } from "./coupon/ShoppingCouponPayment";
import { ShoppingCouponSelect } from "./coupon/ShoppingCouponSelect";

interface ShoppingCartProps {
  cart: CartItemType[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  products: ProductWithUI[];
  setCart: React.Dispatch<React.SetStateAction<CartItemType[]>>;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const ShoppingCart = ({
  cart,
  setCart,
  coupons,
  selectedCoupon,
  products,
  setSelectedCoupon,
  handleNotificationAdd,
}: ShoppingCartProps) => {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <IconCartSymbol className="w-5 h-5 mr-2" strokeWidth={2} />
            장바구니
          </h2>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <IconCartSymbol className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  cart={cart}
                  products={products}
                  setCart={setCart}
                  handleNotificationAdd={handleNotificationAdd}
                />
              ))}
            </div>
          )}
        </section>

        {cart.length > 0 && (
          <>
            <ShoppingCouponSelect
              cart={cart}
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              setSelectedCoupon={setSelectedCoupon}
              handleNotificationAdd={handleNotificationAdd}
            />
            <ShoppingCouponPayment
              cart={cart}
              selectedCoupon={selectedCoupon}
              setCart={setCart}
              setSelectedCoupon={setSelectedCoupon}
              handleNotificationAdd={handleNotificationAdd}
            />
          </>
        )}
      </div>
    </div>
  );
};
