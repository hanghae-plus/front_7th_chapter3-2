import React from 'react';
import { Product, CartItem, Coupon } from '../../../types';
import Products from './Products.tsx';
import Cart from './Cart.tsx';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface CartContainerProps {
  products: ProductWithUI[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  getRemainingStock: (product: Product) => number;
  formatPrice: (price: number, productId?: string) => string;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  completeOrder: () => void;
  calculateItemTotal: (item: CartItem) => number;
  debouncedSearchTerm: string;
}

const CartContainer: React.FC<CartContainerProps> = (props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Products 
        products={props.products}
        getRemainingStock={props.getRemainingStock}
        formatPrice={props.formatPrice}
        addToCart={props.addToCart}
        debouncedSearchTerm={props.debouncedSearchTerm}
      />
      <Cart 
        cart={props.cart}
        coupons={props.coupons}
        selectedCoupon={props.selectedCoupon}
        totals={props.totals}
        removeFromCart={props.removeFromCart}
        updateQuantity={props.updateQuantity}
        applyCoupon={props.applyCoupon}
        setSelectedCoupon={props.setSelectedCoupon}
        completeOrder={props.completeOrder}
        calculateItemTotal={props.calculateItemTotal}
      />
    </div>
  );
};

export default CartContainer;