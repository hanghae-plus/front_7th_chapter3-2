---
name: cart-calculation
description: Extract and implement pure calculation functions for cart/product/discount. Use when separating calculateItemTotal, getMaxApplicableDiscount, calculateCartTotal, updateCartItemQuantity from components.
allowed-tools: Read, Glob, Grep, Edit, Write
---

# Cart Calculation Skill

Guide for extracting and implementing pure calculation functions from shopping cart components.

## Target Functions to Extract

From the original `App.tsx`, extract these calculations:

### 1. calculateItemTotal

Calculate total price for a single cart item with discount applied.

```typescript
// Before: Inside component with external dependency
const calculateItemTotal = (item: CartItem): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item); // calls another function
  return Math.round(price * quantity * (1 - discount));
};

// After: Pure function in utils/cartUtils.ts
export const calculateItemTotal = (item: CartItem): number => {
  const discount = getMaxApplicableDiscount(item);
  return Math.round(item.product.price * item.quantity * (1 - discount));
};
```

### 2. getMaxApplicableDiscount

Find the maximum applicable discount rate for a cart item.

```typescript
// Before: Reads external `cart` state (implicit I/O)
const getMaxApplicableDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  // BAD: Reads external cart state
  const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};

// After: Pure function with explicit parameters
export const getMaxApplicableDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

// If bulk discount logic is needed, make it explicit:
export const getMaxApplicableDiscountWithBulk = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const baseDiscount = getMaxApplicableDiscount(item);
  const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);

  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};
```

### 3. calculateCartTotal

Calculate total cart price with coupon discount.

```typescript
// Before: Inside component, uses component state
const calculateCartTotal = (): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item);
  });

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount = Math.round(totalAfterDiscount * (1 - selectedCoupon.discountValue / 100));
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount)
  };
};

// After: Pure function with explicit parameters
export interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): CartTotal => {
  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalAfterItemDiscount = cart.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );

  let totalAfterDiscount = totalAfterItemDiscount;

  if (selectedCoupon) {
    totalAfterDiscount = applyCouponDiscount(totalAfterItemDiscount, selectedCoupon);
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalBeforeDiscount - totalAfterDiscount),
  };
};

// Helper: Apply coupon discount
export const applyCouponDiscount = (total: number, coupon: Coupon): number => {
  if (coupon.discountType === 'amount') {
    return Math.max(0, total - coupon.discountValue);
  }
  return Math.round(total * (1 - coupon.discountValue / 100));
};
```

### 4. updateCartItemQuantity

Update quantity of an item in cart (immutable update).

```typescript
// After: Pure function returning new cart array
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    return cart.filter(item => item.product.id !== productId);
  }

  return cart.map(item =>
    item.product.id === productId
      ? { ...item, quantity: newQuantity }
      : item
  );
};

// Additional cart operations
export const addItemToCart = (
  cart: CartItem[],
  product: Product,
  quantity: number = 1
): CartItem[] => {
  const existingItem = cart.find(item => item.product.id === product.id);

  if (existingItem) {
    return updateCartItemQuantity(cart, product.id, existingItem.quantity + quantity);
  }

  return [...cart, { product, quantity }];
};

export const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter(item => item.product.id !== productId);
};
```

### 5. getRemainingStock

Calculate remaining stock for a product.

```typescript
// After: Pure function
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity ?? 0);
};
```

## File Structure

```
src/basic/
├── utils/
│   ├── cartUtils.ts       ← Cart calculations
│   ├── discountUtils.ts   ← Discount calculations
│   └── productUtils.ts    ← Product calculations
├── hooks/
├── components/
└── App.tsx
```

## Complete cartUtils.ts Example

```typescript
// src/basic/utils/cartUtils.ts
import { CartItem, Coupon, Product } from '../../types';

export interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

export const getMaxApplicableDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

export const calculateItemTotal = (item: CartItem): number => {
  const discount = getMaxApplicableDiscount(item);
  return Math.round(item.product.price * item.quantity * (1 - discount));
};

export const applyCouponDiscount = (total: number, coupon: Coupon): number => {
  if (coupon.discountType === 'amount') {
    return Math.max(0, total - coupon.discountValue);
  }
  return Math.round(total * (1 - coupon.discountValue / 100));
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): CartTotal => {
  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalAfterItemDiscount = cart.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );

  const totalAfterDiscount = selectedCoupon
    ? applyCouponDiscount(totalAfterItemDiscount, selectedCoupon)
    : totalAfterItemDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalBeforeDiscount - totalAfterDiscount),
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    return cart.filter(item => item.product.id !== productId);
  }

  return cart.map(item =>
    item.product.id === productId
      ? { ...item, quantity: newQuantity }
      : item
  );
};

export const addItemToCart = (
  cart: CartItem[],
  product: Product,
  quantity: number = 1
): CartItem[] => {
  const existingItem = cart.find(item => item.product.id === product.id);

  if (existingItem) {
    return updateCartItemQuantity(cart, product.id, existingItem.quantity + quantity);
  }

  return [...cart, { product, quantity }];
};

export const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter(item => item.product.id !== productId);
};

export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find(item => item.product.id === product.id);
  return product.stock - (cartItem?.quantity ?? 0);
};
```

## Testing Guidelines

These pure functions are easy to test:

```typescript
// __tests__/cartUtils.test.ts
import { calculateItemTotal, getMaxApplicableDiscount } from '../utils/cartUtils';

describe('getMaxApplicableDiscount', () => {
  it('returns 0 when no discounts apply', () => {
    const item = {
      product: { id: '1', name: 'Test', price: 1000, stock: 10, discounts: [] },
      quantity: 5,
    };
    expect(getMaxApplicableDiscount(item)).toBe(0);
  });

  it('returns correct discount rate when quantity threshold met', () => {
    const item = {
      product: {
        id: '1',
        name: 'Test',
        price: 1000,
        stock: 20,
        discounts: [{ quantity: 10, rate: 0.1 }],
      },
      quantity: 10,
    };
    expect(getMaxApplicableDiscount(item)).toBe(0.1);
  });
});
```

## Checklist

When extracting calculations:

- [ ] Function has NO external state dependencies (reads from arguments only)
- [ ] Function returns a value (no void, no side effects)
- [ ] Function is exported from a utils file
- [ ] Unit tests written for the function
- [ ] Component uses the extracted function
