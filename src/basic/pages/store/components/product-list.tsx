import { Dispatch, SetStateAction, useCallback } from 'react';
import Button from '../../../components/button';
import { ImageIcon } from '../../../components/icons';
import { AddNotification } from '../../../hooks/notifications';
import { CartItem } from '../../../types/carts';
import { ProductWithUI } from '../../../types/products';
import { getRemainingStock, addItemToCart } from '../../../models/cart';
import { formatPrice } from '../../../utils/format';

interface NoResultsProps {
  keyword: string;
}

interface ProductItemProps {
  product: ProductWithUI;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  addNotification: AddNotification;
}

interface ProductListProps {
  products: ProductWithUI[];
  debouncedSearchTerm: string;
  addNotification: AddNotification;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
}

const NoResults = ({ keyword }: NoResultsProps) => {
  return (
    <div className='text-center py-12'>
      <p className='text-gray-500'>"{keyword}"에 대한 검색 결과가 없습니다.</p>
    </div>
  );
};

const ProductItem = ({ product, cart, setCart, addNotification }: ProductItemProps) => {
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);

      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
            return prevCart;
          }

          return prevCart.map(item => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item));
        }

        return addItemToCart(prevCart, product);
      });

      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, setCart, addNotification]
  );

  const remainingStock = getRemainingStock(product, cart);

  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow'>
      {/* 상품 이미지 영역 (placeholder) */}
      <div className='relative'>
        <div className='aspect-square bg-gray-100 flex items-center justify-center'>
          <ImageIcon className='text-gray-300' />
        </div>
        {product.isRecommended && <span className='absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded'>BEST</span>}
        {product.discounts.length > 0 && (
          <span className='absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded'>
            ~{Math.max(...product.discounts.map(d => d.rate)) * 100}%
          </span>
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
          {product.discounts.length > 0 && (
            <p className='text-xs text-gray-500'>
              {product.discounts[0].quantity}개 이상 구매시 할인 {product.discounts[0].rate * 100}%
            </p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className='mb-3'>
          {remainingStock <= 5 && remainingStock > 0 && <p className='text-xs text-red-600 font-medium'>품절임박! {remainingStock}개 남음</p>}
          {remainingStock > 5 && <p className='text-xs text-gray-500'>재고 {remainingStock}개</p>}
        </div>

        {/* 장바구니 버튼 */}
        <Button size='lg' variant='dark' onClick={() => addToCart(product)} disabled={remainingStock <= 0} className={'w-full'}>
          {remainingStock <= 0 ? '품절' : '장바구니 담기'}
        </Button>
      </div>
    </div>
  );
};

const ProductList = ({ products, debouncedSearchTerm, addNotification, cart, setCart }: ProductListProps) => {
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        product =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return filteredProducts.length === 0 ? (
    <NoResults keyword={debouncedSearchTerm} />
  ) : (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {filteredProducts.map(product => (
        <ProductItem key={product.id} product={product} cart={cart} setCart={setCart} addNotification={addNotification} />
      ))}
    </div>
  );
};

export default ProductList;
