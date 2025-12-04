---
name: entity-hooks
description: Extract and implement entity-related Custom Hooks (useCart, useCoupon, useProduct, useLocalStorage). Use when separating state management logic from components following Headless UI pattern.
allowed-tools: Read, Glob, Grep, Edit, Write
---

# Entity Hooks Skill

Guide for extracting entity-related Custom Hooks from shopping cart components.

## Target Hooks to Extract

### 1. useLocalStorage (Utility Hook)

Reusable hook for localStorage persistence.

```typescript
// src/basic/hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      if (storedValue === undefined || storedValue === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Memoized setter
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? value(prev) : value;
      return nextValue;
    });
  }, []);

  return [storedValue, setValue];
}
```

### 2. useCart (Entity Hook)

Manages cart state and operations.

```typescript
// src/basic/hooks/useCart.ts
import { useState, useCallback, useMemo } from 'react';
import { CartItem, Product, Coupon } from '../../types';
import {
  calculateCartTotal,
  calculateItemTotal,
  updateCartItemQuantity,
  addItemToCart,
  removeItemFromCart,
  getRemainingStock,
} from '../utils/cartUtils';
import { useLocalStorage } from './useLocalStorage';

interface UseCartReturn {
  // State
  cart: CartItem[];
  selectedCoupon: Coupon | null;

  // Derived data
  cartTotal: ReturnType<typeof calculateCartTotal>;
  totalItemCount: number;

  // Actions
  addToCart: (product: Product) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  applyCoupon: (coupon: Coupon | null) => void;
  clearCart: () => void;

  // Helpers
  getRemainingStock: (product: Product) => number;
  getItemTotal: (item: CartItem) => number;
}

export function useCart(products: Product[]): UseCartReturn {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Derived data (calculations)
  const cartTotal = useMemo(
    () => calculateCartTotal(cart, selectedCoupon),
    [cart, selectedCoupon]
  );

  const totalItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Actions
  const addToCart = useCallback((product: Product) => {
    const remaining = getRemainingStock(product, cart);

    if (remaining <= 0) {
      return { success: false, message: '재고가 부족합니다!' };
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem && existingItem.quantity >= product.stock) {
      return { success: false, message: `재고는 ${product.stock}개까지만 있습니다.` };
    }

    setCart(prev => addItemToCart(prev, product));
    return { success: true, message: '장바구니에 담았습니다' };
  }, [cart, setCart]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => removeItemFromCart(prev, productId));
  }, [setCart]);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      return { success: false, message: '상품을 찾을 수 없습니다.' };
    }

    if (newQuantity > product.stock) {
      return { success: false, message: `재고는 ${product.stock}개까지만 있습니다.` };
    }

    setCart(prev => updateCartItemQuantity(prev, productId, newQuantity));
    return { success: true };
  }, [products, removeFromCart, setCart]);

  const applyCoupon = useCallback((coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart]);

  // Helpers
  const getRemainingStockForProduct = useCallback(
    (product: Product) => getRemainingStock(product, cart),
    [cart]
  );

  const getItemTotal = useCallback(
    (item: CartItem) => calculateItemTotal(item),
    []
  );

  return {
    cart,
    selectedCoupon,
    cartTotal,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
    getRemainingStock: getRemainingStockForProduct,
    getItemTotal,
  };
}
```

### 3. useProducts (Entity Hook)

Manages product state and CRUD operations.

```typescript
// src/basic/hooks/useProducts.ts
import { useCallback } from 'react';
import { Product } from '../../types';
import { useLocalStorage } from './useLocalStorage';

interface UseProductsReturn {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
}

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
  },
];

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);

  const addProduct = useCallback((newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts(prev => [...prev, product]);
  }, [setProducts]);

  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  }, [setProducts]);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, [setProducts]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
```

### 4. useCoupons (Entity Hook)

Manages coupon state and operations.

```typescript
// src/basic/hooks/useCoupons.ts
import { useCallback } from 'react';
import { Coupon } from '../../types';
import { useLocalStorage } from './useLocalStorage';

interface UseCouponsReturn {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => { success: boolean; message?: string };
  deleteCoupon: (couponCode: string) => void;
}

const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

export function useCoupons(): UseCouponsReturn {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);

  const addCoupon = useCallback((newCoupon: Coupon) => {
    const exists = coupons.some(c => c.code === newCoupon.code);
    if (exists) {
      return { success: false, message: '이미 존재하는 쿠폰 코드입니다.' };
    }

    setCoupons(prev => [...prev, newCoupon]);
    return { success: true, message: '쿠폰이 추가되었습니다.' };
  }, [coupons, setCoupons]);

  const deleteCoupon = useCallback((couponCode: string) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
  }, [setCoupons]);

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
}
```

### 5. useDebounce (Utility Hook)

Debounce value changes for search input.

```typescript
// src/basic/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## File Structure

```
src/basic/
├── hooks/
│   ├── index.ts           ← Re-export all hooks
│   ├── useLocalStorage.ts ← Utility hook
│   ├── useDebounce.ts     ← Utility hook
│   ├── useCart.ts         ← Entity hook
│   ├── useProducts.ts     ← Entity hook
│   └── useCoupons.ts      ← Entity hook
├── utils/
├── components/
└── App.tsx
```

## Hook Classification

| Entity Hooks | Utility Hooks |
|-------------|---------------|
| `useCart` - manages CartItem[] | `useLocalStorage` - generic persistence |
| `useProducts` - manages Product[] | `useDebounce` - generic debouncing |
| `useCoupons` - manages Coupon[] | `useModal` - UI state management |

## Headless UI Pattern Rules

Hooks should return:
- **State**: Current data values
- **Derived Data**: Computed values from state
- **Actions**: Functions to modify state
- **Helpers**: Utility functions for computations

Hooks should NOT return:
- JSX elements
- React components
- CSS classes or styles

```typescript
// Good: Returns data and handlers
function useCart() {
  return {
    cart,           // State
    cartTotal,      // Derived data
    addToCart,      // Action
    getItemTotal,   // Helper
  };
}

// Bad: Returns JSX
function useCart() {
  const CartDisplay = () => <div>{cart.length}</div>; // Don't do this!
  return { CartDisplay };
}
```

## Usage in Components

```typescript
// CartPage.tsx
function CartPage() {
  const { products } = useProducts();
  const { coupons } = useCoupons();
  const {
    cart,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    selectedCoupon,
  } = useCart(products);

  return (
    <div>
      <ProductList
        products={products}
        onAddToCart={addToCart}
      />
      <Cart
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
      <CouponSelector
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        onSelect={applyCoupon}
      />
      <CartSummary total={cartTotal} />
    </div>
  );
}
```

## Checklist

When creating entity hooks:

- [ ] Hook name starts with `use` + entity name (e.g., `useCart`)
- [ ] Returns state, derived data, actions, and helpers
- [ ] NO JSX returned from hook
- [ ] Uses useCallback for action functions
- [ ] Uses useMemo for derived data
- [ ] Integrates with useLocalStorage for persistence if needed
- [ ] Has clear TypeScript return type interface
