import { CartItem, Product } from "../../../types";
import { CartListItem } from "./CartListItem";
import { IconShopping } from "../../../components/icons";

export function CartList({
  cart,
  removeFromCart,
  updateQuantity,
  calculateItemTotal,
}: {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (product: Product, newQuantity: number) => void;
  calculateItemTotal: (item: CartItem) => number;
}) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <IconShopping className="w-5 h-5 mr-2" />
        장바구니
      </h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <IconShopping className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => {
            return (
              <CartListItem
                key={item.product.id}
                item={item}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                calculateItemTotal={calculateItemTotal}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
