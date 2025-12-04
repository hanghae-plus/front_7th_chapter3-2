---
name: component-hierarchy
description: Separate components into Container/Presenter hierarchy with proper entity/UI classification. Use when restructuring components following SRP - separating ProductCard, Cart, AdminPage, etc.
allowed-tools: Read, Glob, Grep, Edit, Write
---

# Component Hierarchy Skill

Guide for separating components into proper hierarchy following Single Responsibility Principle.

## Component Classification

### 1. Entity Components vs UI Components

| Entity Components | UI Components |
|-------------------|---------------|
| Know about domain entities | No entity knowledge |
| `ProductCard`, `CartItem`, `CouponCard` | `Button`, `Input`, `Modal` |
| Receive entity as props | Receive primitive props |
| Import from `types.ts` | No domain imports |

### 2. Container vs Presenter

| Container | Presenter |
|-----------|-----------|
| Uses hooks | No hooks (or minimal UI hooks) |
| Manages state | Receives props only |
| Has business logic | Pure rendering |
| `CartPage`, `AdminPage` | `ProductList`, `CartItemView` |

## Target Component Structure

```
src/basic/
├── components/
│   ├── cart/
│   │   ├── Cart.tsx              ← Container
│   │   ├── CartItem.tsx          ← Presenter (entity)
│   │   ├── CartSummary.tsx       ← Presenter (entity)
│   │   └── index.ts
│   ├── product/
│   │   ├── ProductList.tsx       ← Container
│   │   ├── ProductCard.tsx       ← Presenter (entity)
│   │   └── index.ts
│   ├── coupon/
│   │   ├── CouponSelector.tsx    ← Container
│   │   ├── CouponCard.tsx        ← Presenter (entity)
│   │   └── index.ts
│   ├── admin/
│   │   ├── AdminPage.tsx         ← Container
│   │   ├── ProductManagement.tsx ← Container
│   │   ├── CouponManagement.tsx  ← Container
│   │   └── index.ts
│   └── ui/                       ← Pure UI (no entity)
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── index.ts
└── pages/
    ├── CartPage.tsx              ← Page Container
    └── AdminPage.tsx             ← Page Container
```

## Component Examples

### 1. ProductCard (Presenter - Entity)

```typescript
// components/product/ProductCard.tsx
import { Product } from '../../../types';

interface ProductCardProps {
  product: Product;
  remainingStock: number;
  onAddToCart: () => void;
}

export function ProductCard({ product, remainingStock, onAddToCart }: ProductCardProps) {
  const isSoldOut = remainingStock <= 0;
  const maxDiscountRate = product.discounts.length > 0
    ? Math.max(...product.discounts.map(d => d.rate))
    : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
        <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {maxDiscountRate > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            ~{maxDiscountRate * 100}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        <p className="text-lg font-bold text-gray-900 mb-3">
          {isSoldOut ? 'SOLD OUT' : `₩${product.price.toLocaleString()}`}
        </p>

        {/* Stock Status */}
        <div className="mb-3">
          {remainingStock <= 5 && remainingStock > 0 && (
            <p className="text-xs text-red-600 font-medium">품절임박! {remainingStock}개 남음</p>
          )}
          {remainingStock > 5 && (
            <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          disabled={isSoldOut}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isSoldOut
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {isSoldOut ? '품절' : '장바구니 담기'}
        </button>
      </div>
    </div>
  );
}
```

### 2. ProductList (Container)

```typescript
// components/product/ProductList.tsx
import { Product } from '../../../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  getRemainingStock: (product: Product) => number;
  onAddToCart: (product: Product) => void;
}

export function ProductList({ products, getRemainingStock, onAddToCart }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          remainingStock={getRemainingStock(product)}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  );
}
```

### 3. CartItem (Presenter - Entity)

```typescript
// components/cart/CartItem.tsx
import { CartItem as CartItemType } from '../../../types';

interface CartItemProps {
  item: CartItemType;
  itemTotal: number;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, itemTotal, onUpdateQuantity, onRemove }: CartItemProps) {
  const originalPrice = item.product.price * item.quantity;
  const hasDiscount = itemTotal < originalPrice;
  const discountRate = hasDiscount
    ? Math.round((1 - itemTotal / originalPrice) * 100)
    : 0;

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 ml-2"
          aria-label="Remove item"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between">
        {/* Quantity Controls */}
        <div className="flex items-center">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            aria-label="Increase quantity"
          >
            <span className="text-xs">+</span>
          </button>
        </div>

        {/* Price */}
        <div className="text-right">
          {hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">
              -{discountRate}%
            </span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {itemTotal.toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
}
```

### 4. Cart (Container)

```typescript
// components/cart/Cart.tsx
import { CartItem as CartItemType } from '../../../types';
import { CartItem } from './CartItem';

interface CartProps {
  items: CartItemType[];
  getItemTotal: (item: CartItemType) => number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function Cart({ items, getItemTotal, onUpdateQuantity, onRemove }: CartProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(item => (
        <CartItem
          key={item.product.id}
          item={item}
          itemTotal={getItemTotal(item)}
          onUpdateQuantity={(quantity) => onUpdateQuantity(item.product.id, quantity)}
          onRemove={() => onRemove(item.product.id)}
        />
      ))}
    </div>
  );
}
```

### 5. CartSummary (Presenter - Entity)

```typescript
// components/cart/CartSummary.tsx
interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

interface CartSummaryProps {
  total: CartTotal;
  onCheckout: () => void;
}

export function CartSummary({ total, onCheckout }: CartSummaryProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">상품 금액</span>
        <span className="font-medium">
          {total.totalBeforeDiscount.toLocaleString()}원
        </span>
      </div>

      {total.totalDiscount > 0 && (
        <div className="flex justify-between text-red-500">
          <span>할인 금액</span>
          <span>-{total.totalDiscount.toLocaleString()}원</span>
        </div>
      )}

      <div className="flex justify-between py-2 border-t border-gray-200">
        <span className="font-semibold">결제 예정 금액</span>
        <span className="font-bold text-lg text-gray-900">
          {total.totalAfterDiscount.toLocaleString()}원
        </span>
      </div>

      <button
        onClick={onCheckout}
        className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
      >
        {total.totalAfterDiscount.toLocaleString()}원 결제하기
      </button>
    </div>
  );
}
```

### 6. Page Component (Composition Root)

```typescript
// pages/CartPage.tsx
import { useProducts } from '../hooks/useProducts';
import { useCoupons } from '../hooks/useCoupons';
import { useCart } from '../hooks/useCart';
import { ProductList } from '../components/product/ProductList';
import { Cart } from '../components/cart/Cart';
import { CartSummary } from '../components/cart/CartSummary';
import { CouponSelector } from '../components/coupon/CouponSelector';

export function CartPage() {
  const { products } = useProducts();
  const { coupons } = useCoupons();
  const {
    cart,
    cartTotal,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
    getRemainingStock,
    getItemTotal,
  } = useCart(products);

  const handleCheckout = () => {
    alert('주문이 완료되었습니다!');
    clearCart();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Product List */}
      <div className="lg:col-span-3">
        <ProductList
          products={products}
          getRemainingStock={getRemainingStock}
          onAddToCart={addToCart}
        />
      </div>

      {/* Cart Sidebar */}
      <div className="lg:col-span-1">
        <section className="bg-white rounded-lg border p-4 mb-4">
          <h2 className="text-lg font-semibold mb-4">장바구니</h2>
          <Cart
            items={cart}
            getItemTotal={getItemTotal}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        </section>

        {cart.length > 0 && (
          <>
            <section className="bg-white rounded-lg border p-4 mb-4">
              <CouponSelector
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onSelect={applyCoupon}
              />
            </section>

            <section className="bg-white rounded-lg border p-4">
              <CartSummary
                total={cartTotal}
                onCheckout={handleCheckout}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
```

## Checklist

When creating component hierarchy:

- [ ] Containers use hooks, presenters receive props
- [ ] Entity components are separate from UI components
- [ ] Each component has single responsibility
- [ ] Props drilling is minimized (use composition or context)
- [ ] Event handlers are passed down, not defined in presenters
- [ ] Components have clear TypeScript interfaces for props
- [ ] Index files re-export components for clean imports
