import Button from '../../../components/button';
import { ShoppingBagIcon, XIcon } from '../../../components/icons';
import { calculateDiscountRate, calculateItemTotal } from '../../../models/cart';
import { CartItem as CartItemType } from '../../../types/carts';
import { ProductWithUI } from '../../../types/products';
import { formatCurrency } from '../../../utils/format';

interface CartItemProps {
  item: CartItemType;
  cart: CartItemType[];
  products: ProductWithUI[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number, products: ProductWithUI[]) => void;
}

interface CartSectionProps {
  products: ProductWithUI[];
  cart: CartItemType[];
  totalItemCount: number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number, products: ProductWithUI[]) => void;
}

const NoResults = () => {
  return (
    <div className='text-center py-8'>
      <ShoppingBagIcon size={64} strokeWidth={1} className='text-gray-300 mx-auto mb-4' />
      <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
    </div>
  );
};

const CartItem = ({ item, cart, products, removeFromCart, updateQuantity }: CartItemProps) => {
  const itemTotal = calculateItemTotal(item, cart);
  const discountRate = calculateDiscountRate(item, cart);

  return (
    <div className='border-b pb-3 last:border-b-0'>
      <div className='flex justify-between items-start mb-2'>
        <h4 className='text-sm font-medium text-gray-900 flex-1'>{item.product.name}</h4>
        <Button variant='delete' onClick={() => removeFromCart(item.product.id)} className='ml-2'>
          <XIcon />
        </Button>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1, products)}
            className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
          >
            <span className='text-xs'>−</span>
          </button>
          <span className='mx-3 text-sm font-medium w-8 text-center'>{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1, products)}
            className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
          >
            <span className='text-xs'>+</span>
          </button>
        </div>
        <div className='text-right'>
          {discountRate > 0 && <span className='text-xs text-red-500 font-medium block'>-{discountRate}%</span>}
          <p className='text-sm font-medium text-gray-900'>{formatCurrency(Math.round(itemTotal), { suffix: '원' })}</p>
        </div>
      </div>
    </div>
  );
};

const CartSection = ({ products, cart, totalItemCount, removeFromCart, updateQuantity }: CartSectionProps) => {
  return (
    <section className='bg-white rounded-lg border border-gray-200 p-4'>
      <h2 className='text-lg font-semibold mb-4 flex items-center'>
        <ShoppingBagIcon className='mr-2' />
        장바구니
      </h2>
      {totalItemCount === 0 ? (
        <NoResults />
      ) : (
        <div className='space-y-3'>
          {cart.map(item => (
            <CartItem
              key={item.product.id}
              item={item}
              cart={cart}
              products={products}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CartSection;
