import { calculateItemTotal } from "../../models/cart";
import { CartItem } from "./CartItem";
import { useCartStore } from "../../store/useCartStore";
import { useNotificationStore } from "../../store/useNotificationStore";

export const CartList = () => {
  // Store에서 상태 및 액션 가져오기
  const { cart, removeFromCart: removeFromCartAction, updateQuantity: updateQuantityAction } =
    useCartStore();
  const { addNotification } = useNotificationStore();

  // Notification 래퍼 함수들
  const removeFromCart = (productId: string) => {
    removeFromCartAction(productId);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const result = updateQuantityAction(productId, quantity);
    if (result) {
      addNotification(result.message, result.success ? "success" : "error");
    }
  };
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        장바구니
      </h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              itemTotal={calculateItemTotal(item, cart)} // 여기서 계산해서 전달
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>
      )}
    </section>
  );
};
