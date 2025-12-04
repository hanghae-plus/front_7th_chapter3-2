# Props vs Hooks 사용 가이드

> 언제 Props를 전달하고, 언제 Hook을 직접 사용할까?

## 🎯 핵심 원칙

### Hook 직접 사용 ✅

**큰 Feature 컴포넌트 = Hook 직접 사용**

```typescript
// ✅ Hook 직접 사용
const ProductList = () => {
  const { products } = useProducts(); // 직접 사용!
  const { addToCart } = useCart();

  return <div>{/* ... */}</div>;
};

const CartSummary = () => {
  const { cart } = useCart(); // 직접 사용!
  const { coupons } = useCoupons();

  return <div>{/* ... */}</div>;
};
```

---

### Props 전달 ✅

**작은 UI 컴포넌트 = Props 전달**

```typescript
// ✅ Props 전달
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => onAddToCart(product)}>담기</button>
    </div>
  );
};

const CartItem = ({ item, onRemove, onUpdate }) => {
  return (
    <div>
      <span>{item.name}</span>
      <button onClick={() => onRemove(item.id)}>삭제</button>
    </div>
  );
};
```

---

## 📋 판단 기준

### 1. 컴포넌트 크기

```typescript
// 큰 컴포넌트 (100줄 이상) → Hook 사용
const ProductList = () => {
  const { products } = useProducts();
  // ...
};

// 작은 컴포넌트 (50줄 이하) → Props 전달
const ProductCard = ({ product }) => {
  // ...
};
```

---

### 2. 역할

```typescript
// Feature 컴포넌트 (기능 단위) → Hook 사용
const CartSummary = () => {
  const { cart } = useCart();
  const { coupons } = useCoupons();
  // 여러 기능 조합
};

// Presentational 컴포넌트 (UI만) → Props 전달
const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

---

### 3. 재사용성

```typescript
// 독립적인 Feature → Hook 사용
const ProductList = () => {
  const { products } = useProducts();
  // 다른 페이지에서도 독립적으로 사용
};

// 재사용되는 UI → Props 전달
const Card = ({ title, content }) => {
  // 여러 곳에서 다른 데이터로 재사용
};
```

---

## 🎯 실전 예시

### CartPage 구조

```typescript
CartPage (레이아웃만)
│
├── ProductList (Hook ✅)
│   └── ProductCard (Props ✅)
│
└── CartSummary (Hook ✅)
    ├── CartItems (Props ✅)
    │   └── CartItem (Props ✅)
    └── OrderSummary (Props ✅)
```

### 코드

```typescript
// CartPage.tsx - 레이아웃
const CartPage = ({ searchTerm }) => {
  return (
    <div className="grid grid-cols-4">
      <ProductList searchTerm={searchTerm} />
      <CartSummary />
    </div>
  );
};

// ProductList.tsx - Hook 사용
const ProductList = ({ searchTerm }) => {
  const { products } = useProducts(); // Hook!
  const { addToCart } = useCart(); // Hook!

  return (
    <div>
      {products.map((p) => (
        <ProductCard product={p} onAdd={addToCart} />
      ))}
    </div>
  );
};

// ProductCard.tsx - Props 전달
const ProductCard = ({ product, onAdd }) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => onAdd(product)}>담기</button>
    </div>
  );
};

// CartSummary.tsx - Hook 사용
const CartSummary = () => {
  const { cart, removeFromCart } = useCart(); // Hook!
  const { coupons, applyCoupon } = useCoupons(); // Hook!

  return (
    <div>
      <CartItems cart={cart} onRemove={removeFromCart} />
      <CouponSelector coupons={coupons} onApply={applyCoupon} />
    </div>
  );
};

// CartItems.tsx - Props 전달
const CartItems = ({ cart, onRemove }) => {
  return (
    <div>
      {cart.map((item) => (
        <CartItem item={item} onRemove={onRemove} />
      ))}
    </div>
  );
};
```

---

## ✅ 빠른 체크리스트

**Hook을 직접 사용할까?**

- [ ] Feature 컴포넌트인가? (ProductList, CartSummary)
- [ ] 100줄 이상인가?
- [ ] 여러 Hook을 조합하는가?
- [ ] 독립적으로 동작하는가?

→ **Yes가 2개 이상이면 Hook 사용**

**Props를 전달할까?**

- [ ] UI만 담당하는가? (ProductCard, CartItem)
- [ ] 50줄 이하인가?
- [ ] 재사용되는가?
- [ ] 순수 컴포넌트인가? (같은 props → 같은 결과)

→ **Yes가 2개 이상이면 Props 전달**

---

## 🎓 핵심 정리

| 구분       | Hook 사용                | Props 전달            |
| ---------- | ------------------------ | --------------------- |
| **크기**   | 큰 컴포넌트 (100줄+)     | 작은 컴포넌트 (50줄-) |
| **역할**   | Feature (기능)           | Presentational (UI)   |
| **재사용** | 독립적                   | 재사용 가능           |
| **예시**   | ProductList, CartSummary | ProductCard, CartItem |

**기억하기:**

- 큰 Feature = Hook
- 작은 UI = Props

🚀
