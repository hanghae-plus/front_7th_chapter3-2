import { CartItem } from '../../../types/carts';
import { ProductWithUI } from '../../../types/products';
import ProductList from './product-list';

interface ProductSectionProps {
  products: ProductWithUI[];
  debouncedSearchTerm: string;
  cart: CartItem[];
  addToCart: (product: ProductWithUI) => void;
}

const ProductSection = ({ products, debouncedSearchTerm, cart, addToCart }: ProductSectionProps) => {
  return (
    <section>
      <div className='mb-6 flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
        <div className='text-sm text-gray-600'>총 {products.length}개 상품</div>
      </div>
      <ProductList products={products} debouncedSearchTerm={debouncedSearchTerm} cart={cart} addToCart={addToCart} />
    </section>
  );
};

export default ProductSection;
