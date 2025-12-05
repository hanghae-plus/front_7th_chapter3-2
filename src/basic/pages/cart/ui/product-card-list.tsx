import { CartItem } from '../../../../types';
import { getRemainingStock } from '../../../entities/cart';
import { ProductCard, ProductWithUI } from '../../../entities/product';
import { mapProductToViewModel } from '../../../entities/product/model/product-view-mapper';
import { useAddCart } from '../../../features/cart/add-cart';
import { ToastProps } from '../../../shared/ui/toast';

interface PropsType {
  products: ProductWithUI[];
  cart: CartItem[];
  addToCart: (product: ProductWithUI) => void;
  toast: (notification: ToastProps) => void;
}

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
        const viewModel = mapProductToViewModel(product, remainingStock);

        return (
          <ProductCard
            key={product.id}
            viewModel={viewModel}
            onAddCart={() => handleAddCart(product)}
          />
        );
      })}
    </div>
  );
}
