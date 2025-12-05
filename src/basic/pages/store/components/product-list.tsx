import Button from '../../../components/button';
import { ImageIcon } from '../../../components/icons';
import { getRemainingStock } from '../../../models/cart';
import { filterProductsBySearchTerm, formatFirstDiscount, getCartButtonText, getMaxDiscountRate, getStockStatusText } from '../../../models/product';
import { CartItem } from '../../../types/carts';
import { ProductWithUI } from '../../../types/products';
import { formatPrice } from '../../../utils/format';

interface NoResultsProps {
  keyword: string;
}

interface ProductItemProps {
  product: ProductWithUI;
  cart: CartItem[];
  addToCart: (product: ProductWithUI) => void;
}

interface ProductListProps {
  products: ProductWithUI[];
  debouncedSearchTerm: string;
  cart: CartItem[];
  addToCart: (product: ProductWithUI) => void;
}

const NoResults = ({ keyword }: NoResultsProps) => {
  return (
    <div className='text-center py-12'>
      <p className='text-gray-500'>"{keyword}"에 대한 검색 결과가 없습니다.</p>
    </div>
  );
};

const ProductItem = ({ product, cart, addToCart }: ProductItemProps) => {
  const remainingStock = getRemainingStock(product, cart);
  const stockStatus = getStockStatusText(remainingStock);

  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow'>
      {/* 상품 이미지 영역 (placeholder) */}
      <div className='relative'>
        <div className='aspect-square bg-gray-100 flex items-center justify-center'>
          <ImageIcon className='text-gray-300' />
        </div>
        {product.isRecommended && <span className='absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded'>BEST</span>}
        {product.discounts.length > 0 && (
          <span className='absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded'>~{getMaxDiscountRate(product)}%</span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className='p-4'>
        <h3 className='font-medium text-gray-900 mb-1'>{product.name}</h3>
        {product.description && <p className='text-sm text-gray-500 mb-2 line-clamp-2'>{product.description}</p>}

        {/* 가격 정보 */}
        <div className='mb-3'>
          <p className='text-lg font-bold text-gray-900'>
            {formatPrice(product.price, {
              prefix: '₩',
              isSoldOut: remainingStock <= 0
            })}
          </p>
          {formatFirstDiscount(product) && <p className='text-xs text-gray-500'>{formatFirstDiscount(product)}</p>}
        </div>

        {/* 재고 상태 */}
        {stockStatus && (
          <div className='mb-3'>
            <p className={stockStatus.className}>{stockStatus.text}</p>
          </div>
        )}

        {/* 장바구니 버튼 */}
        <Button size='lg' variant='dark' onClick={() => addToCart(product)} disabled={remainingStock <= 0} className='w-full'>
          {getCartButtonText(remainingStock)}
        </Button>
      </div>
    </div>
  );
};

const ProductList = ({ products, debouncedSearchTerm, cart, addToCart }: ProductListProps) => {
  const filteredProducts = filterProductsBySearchTerm(products, debouncedSearchTerm);

  return filteredProducts.length === 0 ? (
    <NoResults keyword={debouncedSearchTerm} />
  ) : (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {filteredProducts.map(product => (
        <ProductItem key={product.id} product={product} cart={cart} addToCart={addToCart} />
      ))}
    </div>
  );
};

export default ProductList;
