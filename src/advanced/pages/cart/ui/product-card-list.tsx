import { useCart } from '../../../entities/cart/model/use-cart';
import { getRemainingStock } from '../../../entities/cart';
import { ProductCard, ProductWithUI } from '../../../entities/product';
import { mapProductToViewModel } from '../../../entities/product/model/product-view-mapper';
import { useAddCart } from '../../../features/cart/add-cart';

interface PropsType {
  products: ProductWithUI[];
}

export function ProductCardList({ products }: PropsType) {
  const { cart } = useCart();
  const { handleAddCart } = useAddCart();

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
