import { Dispatch, SetStateAction, useCallback } from 'react';
import Button from '../../../components/button';
import { ShoppingBagIcon, XIcon } from '../../../components/icons';
import { AddNotification } from '../../../hooks/notifications';
import { CartItem } from '../../../types/carts';
import { ProductWithUI } from '../../../types/products';
import { removeItemFromCart, updateCartItemQuantity } from '../../../models/cart';

interface CartSectionProps {
  products: ProductWithUI[];
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  calculateItemTotal: (item: CartItem) => number;
  addNotification: AddNotification;
}

const NoResults = () => {
  return (
    <div className='text-center py-8'>
      <ShoppingBagIcon size={64} strokeWidth={1} className='text-gray-300 mx-auto mb-4' />
      <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
    </div>
  );
};

const CartSection = ({ products, cart, setCart, calculateItemTotal, addNotification }: CartSectionProps) => {
  const removeFromCart = useCallback(
    (productId: string) => {
      setCart(prevCart => removeItemFromCart(prevCart, productId));
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find(p => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      setCart(prevCart => updateCartItemQuantity(prevCart, productId, newQuantity));
    },
    [products, setCart, removeFromCart, addNotification]
  );

  return (
    <section className='bg-white rounded-lg border border-gray-200 p-4'>
      <h2 className='text-lg font-semibold mb-4 flex items-center'>
        <ShoppingBagIcon className='mr-2' />
        장바구니
      </h2>
      {cart.length === 0 ? (
        <NoResults />
      ) : (
        <div className='space-y-3'>
          {cart.map(item => {
            const itemTotal = calculateItemTotal(item);
            const originalPrice = item.product.price * item.quantity;
            const hasDiscount = itemTotal < originalPrice;
            const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

            return (
              <div key={item.product.id} className='border-b pb-3 last:border-b-0'>
                <div className='flex justify-between items-start mb-2'>
                  <h4 className='text-sm font-medium text-gray-900 flex-1'>{item.product.name}</h4>
                  <Button variant='delete' onClick={() => removeFromCart(item.product.id)} className='ml-2'>
                    <XIcon />
                  </Button>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                    >
                      <span className='text-xs'>−</span>
                    </button>
                    <span className='mx-3 text-sm font-medium w-8 text-center'>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                    >
                      <span className='text-xs'>+</span>
                    </button>
                  </div>
                  <div className='text-right'>
                    {hasDiscount && <span className='text-xs text-red-500 font-medium block'>-{discountRate}%</span>}
                    <p className='text-sm font-medium text-gray-900'>{Math.round(itemTotal).toLocaleString()}원</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CartSection;
