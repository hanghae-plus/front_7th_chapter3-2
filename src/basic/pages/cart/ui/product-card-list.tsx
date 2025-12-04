import { CartItem, Product } from '../../../../types';
import { ProductCard, ProductWithUI } from '../../../entities/product';
import { useAddCart } from '../../../features/cart/add-cart';
import { ToastProps } from '../../../shared/ui/toast';

interface PropsType {
  products: ProductWithUI[];
  cart: CartItem[];
  addToCart: (product: ProductWithUI) => void;
  toast: (notification: ToastProps) => void;
}

// REFACTOR
const getRemainingStock = (cart: CartItem[], product: Product): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

export function ProductCardList({
  products,
  cart,
  addToCart,
  toast,
}: PropsType) {
  const { handleAddCart } = useAddCart({ addToCart, toast });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const remainingStock = getRemainingStock(cart, product);

        return (
          <ProductCard
            product={product}
            remainingStock={remainingStock}
            onAddCart={() => handleAddCart(product)}
          />
        );
      })}
    </div>
  );
}
