import { CartItem as CartItemType } from "../../../../types";
import { IconClose } from "../../common/icons/IconClose";
import { Button } from "../../common/ui/Button";
import {
  updateCartItemQuantity,
  removeProductFromCart,
} from "../../../models/cart";
import { exceedsStock } from "../../../models/product";
import { calculateCartItemViewData } from "../../../utils/viewData";
import { useCart } from "../../../hooks/useCart";
import { useProducts } from "../../../hooks/useProducts";
import { useNotification } from "../../../hooks/useNotification";

interface CartItemProps {
  item: CartItemType;
}

/**
 * 장바구니 아이템 엔티티 컴포넌트
 * CartItem 엔티티를 표시하고 조작하는 컴포넌트
 */
export const CartItem = ({ item }: CartItemProps) => {
  const { cart, setCart } = useCart();
  const { products } = useProducts();
  const { addNotification } = useNotification();

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (exceedsStock(product, newQuantity)) {
      addNotification(
        `재고는 ${product.stock}개까지만 있습니다.`,
        "error"
      );
      return;
    }

    const nextCart = updateCartItemQuantity(cart, productId, newQuantity);
    setCart(nextCart);
  };

  const removeFromCart = (productId: string) => {
    const nextCart = removeProductFromCart(cart, productId);
    setCart(nextCart);
  };

  const viewData = calculateCartItemViewData(cart, item);

  return (
    <div key={item.product.id} className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <Button
          onClick={() => removeFromCart(item.product.id)}
          variant="icon"
          className="ml-2"
        >
          <IconClose />
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            variant="secondary"
            size="xs"
            className="w-6 h-6 p-0 flex items-center justify-center"
          >
            <span className="text-xs">−</span>
          </Button>
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <Button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            variant="secondary"
            size="xs"
            className="w-6 h-6 p-0 flex items-center justify-center"
          >
            <span className="text-xs">+</span>
          </Button>
        </div>
        <div className="text-right">
          {viewData.hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">
              -{viewData.discountRate}%
            </span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {Math.round(viewData.itemTotal).toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};
