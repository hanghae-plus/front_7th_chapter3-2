import { calculateItemTotal } from "../../models/cart";
import { CartItem } from "./CartItem";
import { useCartStore } from "../../store/useCartStore";

/**
 * CartList - 장바구니 목록 컴포넌트
 *
 * Props drilling 제거: 콜백 함수를 자식에게 전달하지 않음
 * CartItem이 내부에서 직접 store를 호출합니다.
 */
export const CartList = () => {
  // Store에서 cart 상태만 가져오기
  const { cart } = useCartStore();

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
              itemTotal={calculateItemTotal(item, cart)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
