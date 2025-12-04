import { ProductWithUI } from '../../types';
import ProductItem from './ProductItem';

interface ProductListProps {
  products: ProductWithUI[];
  getRemainingStock: (product: ProductWithUI) => number;
  onAddToCart: (product: ProductWithUI) => void;
}

const ProductList = ({
  products,
  getRemainingStock,
  onAddToCart,
}: ProductListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          remainingStock={getRemainingStock(product)}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
