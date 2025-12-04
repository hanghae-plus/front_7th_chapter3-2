## 과제의 핵심취지

- React의 hook 이해하기
- 함수형 프로그래밍에 대한 이해
- 액션과 순수함수의 분리

## 과제에서 꼭 알아가길 바라는 점

- 엔티티를 다루는 상태와 그렇지 않은 상태 - cart, isCartFull vs isShowPopup
- 엔티티를 다루는 컴포넌트와 훅 - CartItemView, useCart(), useProduct()
- 엔티티를 다루지 않는 컴포넌트와 훅 - Button, useRoute, useEvent 등
- 엔티티를 다루는 함수와 그렇지 않은 함수 - calculateCartTotal(cart) vs capaitalize(str)

### 기본과제

- Component에서 비즈니스 로직을 분리하기
- 비즈니스 로직에서 특정 엔티티만 다루는 계산을 분리하기
- 뷰데이터와 엔티티데이터의 분리에 대한 이해
- entities -> features -> UI 계층에 대한 이해

- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [x] 계산함수는 순수함수로 작성이 되었나요?
- [x] 특정 Entitiy만 다루는 함수는 분리되어 있나요?
- [x] 특정 Entitiy만 다루는 Component와 UI를 다루는 Component는 분리되어 있나요?
- [x] 데이터 흐름에 맞는 계층구조를 이루고 의존성이 맞게 작성이 되었나요?

### 심화과제

- 이번 심화과제는 Context나 Jotai를 사용해서 Props drilling을 없애는 것입니다.
- 어떤 props는 남겨야 하는지, 어떤 props는 제거해야 하는지에 대한 기준을 세워보세요.
- Context나 Jotai를 사용하여 상태를 관리하는 방법을 익히고, 이를 통해 컴포넌트 간의 데이터 전달을 효율적으로 처리할 수 있습니다.

- [x] Context나 Jotai를 사용해서 전역상태관리를 구축했나요?
- [x] 전역상태관리를 통해 domain custom hook을 적절하게 리팩토링 했나요?
- [x] 도메인 컴포넌트에 도메인 props는 남기고 props drilling을 유발하는 불필요한 props는 잘 제거했나요?
- [x] 전체적으로 분리와 재조립이 더 수월해진 결합도가 낮아진 코드가 되었나요?

## 과제 셀프회고

<!-- 과제에 대한 회고를 작성해주세요 -->

### 설계 관점에서 중점적으로 진행한 부분

이번 과제에서 가장 중점적으로 신경 쓴 부분은 **각 도메인에 대한 서비스 객체를 제공하여 가독성과 사용성 측면에서 이점을 누리고자 한 설계**입니다. Context를 통해 단순히 데이터와 함수를 제공하는 것이 아니라, 각 엔티티가 자신의 동작을 메서드로 가지는 인스턴스 객체를 제공하는 방식으로 구현했습니다.

#### 서비스 객체 패턴 적용 전후 비교

**1. 장바구니 아이템 수량 업데이트**

**적용 전:**

```typescript
// 컴포넌트에서 사용할 때
const handleIncrease = () => {
  updateCartItemQuantity(cart, item.product.id, item.quantity + 1);
};

// 또는 더 복잡한 경우
const handleIncrease = () => {
  const newCart = cart.map((cartItem) =>
    cartItem.product.id === item.product.id
      ? { ...cartItem, quantity: cartItem.quantity + 1 }
      : cartItem
  );
  setCart(newCart);
};
```

**적용 후 (서비스 객체 패턴):**

```typescript
// 컴포넌트에서 사용할 때
const handleIncrease = () => {
  item.updateQuantity(item.quantity + 1);
};
```

**가독성 향상 효과:**

- `item.updateQuantity()`를 보면 "이 아이템의 수량을 업데이트한다"는 의미가 메서드 이름에 그대로 드러납니다.
- 기존 방식의 접근에서는 `updateCartItemQuantity(cart, item.product.id, ...)`처럼 여러 인자를 전달해야 하고, "어떤 장바구니의 어떤 아이템을" 수정하는지 파악하기 위해 인자를 모두 읽어야 합니다.
- 서비스 객체 패턴에서는 `item`이라는 주체가 명확하므로, 메서드만 봐도 "이 아이템에 대한 동작"임을 즉시 알 수 있습니다.

**2. 상품 가격 포맷팅**

**적용 전:**

```typescript
// 컴포넌트에서 사용할 때
const priceLabel = formatProductPrice(product, {
  formatOptions: { type: "prefix", prefix: "₩" },
});
```

**적용 후 (서비스 객체 패턴):**

```typescript
// 컴포넌트에서 사용할 때
const priceLabel = product.priceLabel("₩{price}");
```

**가독성 향상 효과:**

- `product.priceLabel()`은 "이 상품의 가격 레이블을 가져온다"는 의미가 직관적입니다.
- 기존 접근에서는 `formatProductPrice(product, ...)`처럼 상품을 인자로 전달해야 하지만, 서비스 객체 패턴에서는 상품이 이미 주체이므로 메서드 호출만으로 충분합니다.
- 특히 `product.priceLabel()`은 "상품이 자신의 가격을 포맷팅한다"는 자연스러운 표현이 되어, 코드를 읽는 사람이 "상품이 가격 정보를 제공한다"는 도메인 개념을 바로 이해할 수 있습니다.

**3. 장바구니 아이템 삭제**

**적용 전:**

```typescript
// 컴포넌트에서 사용할 때
const handleDelete = () => {
  setCart(cart.filter((cartItem) => cartItem.product.id !== item.product.id));
};
```

**적용 후 (서비스 객체 패턴):**

```typescript
// 컴포넌트에서 사용할 때
const handleDelete = () => {
  item.delete();
};
```

**가독성 향상 효과:**

- `item.delete()`는 "이 아이템을 삭제한다"는 의미가 메서드 이름에 완벽하게 드러납니다.
- 함수형 접근에서는 `deleteCartItem(cart, item.product.id)`처럼 "어떤 장바구니에서 어떤 아이템을" 삭제하는지 명시해야 하지만, 서비스 객체 패턴에서는 `item`이 이미 자신의 컨텍스트를 알고 있으므로 메서드 호출만으로 충분합니다.
- 특히 `onDelete: () => item.delete()` 같은 코드를 보면, "이 아이템을 삭제하는 핸들러"라는 의미가 한눈에 들어옵니다.

**4. 상품 수정**

**적용 전:**

```typescript
// 컴포넌트에서 사용할 때
const handleUpdate = (updates: Partial<Product>) => {
  setProducts(
    products.map((p) => (p.id === product.id ? { ...p, ...updates } : p))
  );
};
```

**적용 후 (서비스 객체 패턴):**

```typescript
// 컴포넌트에서 사용할 때
const handleUpdate = (updates: Partial<Product>) => {
  product.update(updates);
};
```

**가독성 향상 효과:**

- `product.update(updates)`는 "이 상품을 업데이트한다"는 의미가 명확합니다.
- 기존 접근에서는 상품 목록 전체와 상품 ID를 전달해야 하지만, 서비스 객체 패턴에서는 상품이 자신의 ID를 알고 있으므로 업데이트할 내용만 전달하면 됩니다.
- 코드를 읽을 때 "상품이 자신을 업데이트한다"는 자연스러운 표현이 되어, 도메인 모델과 코드 표현이 일치합니다.

#### 설계 의도와 효과

이러한 서비스 객체 패턴을 적용한 이유는 다음과 같습니다:

1. **의도 명확성**: `item.updateQuantity(5)`를 보면 "이 아이템의 수량을 5로 업데이트한다"는 의도가 메서드 이름에 그대로 드러납니다. 반면 함수형 접근인 `updateCartItemQuantity(cart, itemId, 5)`는 여러 인자를 읽어야 의도를 파악할 수 있습니다.

2. **컨텍스트 내재화**: 각 인스턴스가 자신의 데이터와 동작을 함께 가지고 있어, 외부에서 컨텍스트를 전달할 필요가 없습니다. 예를 들어 `item.delete()`는 `item`이 이미 자신이 어떤 장바구니에 속해있는지 알고 있으므로, 별도로 장바구니나 아이템 ID를 전달할 필요가 없습니다.

3. **도메인 모델과의 일치**: "장바구니 아이템이 자신의 수량을 업데이트한다"는 도메인 개념이 코드에서 `item.updateQuantity()`로 자연스럽게 표현되어, 코드를 읽는 사람이 비즈니스 로직을 이해하기 쉬워집니다.

4. **코드 간결성**: 함수형 접근에서는 여러 인자를 전달해야 하지만, 서비스 객체 패턴에서는 메서드 호출만으로 충분하여 코드가 간결해집니다.

#### 객체지향과 함수형 프로그래밍의 멀티패러다임 접근

서비스 객체 패턴을 적용하면서도, 내부적으로는 순수 함수를 적극적으로 활용하여 두 패러다임의 장점을 모두 가져가고자 했습니다.

**순수 함수와 비순수 함수의 구분 기준**

코드를 작성할 때 다음과 같은 기준으로 순수 함수와 비순수 함수를 구분했습니다:

1. **순수 함수 (Pure Functions)**: 계산 로직, 변환 로직

   - 입력에 대해 항상 같은 출력을 반환
   - 사이드 이펙트 없음 (외부 상태 변경 없음)
   - 예: `calculateItemTotalPrice`, `applyCouponToTotalPrice`, `getMaxApplicableDiscount`, `getRemainingStock`, `hasBulkPurchase`

2. **비순수 함수 (Impure Functions)**: 상태 변경 로직
   - 상태를 변경하는 동작 (setState 호출)
   - 예: `item.updateQuantity()`, `item.delete()`, `product.update()`

**구체적인 구현 예시**

```typescript
// CartContext.tsx에서 서비스 객체 생성
const cartInstance: CartItemInstance[] = useMemo(
  () =>
    cart.map((item, idx) => ({
      ...item,
      // 순수 함수를 사용하여 계산된 값들을 추가
      totalPrice: calculateItemTotalPrice(item, bulkPurchase), // 순수 함수
      discountRate: Math.round(
        getMaxApplicableDiscount(item, bulkPurchase) * 100 // 순수 함수
      ),
      remainingStock: getRemainingStock(item), // 순수 함수

      // 비순수 함수: 상태를 변경하는 메서드
      updateQuantity: (newQuantity: number) => {
        // 검증 로직 (순수 함수로 분리 가능)
        if (newQuantity < 0) return false;
        if (newQuantity > item.product.stock) return false;

        // 상태 변경 (비순수)
        setCart((prev) => {
          const next = [...prev];
          if (newQuantity === 0) {
            return next.filter((_, i) => i !== idx);
          }
          next[idx].quantity = newQuantity;
          return next;
        });
        return true;
      },
      delete: () => {
        // 상태 변경 (비순수)
        setCart((prev) => prev.filter((_, i) => i !== idx));
      },
    })),
  [cart, bulkPurchase, setCart]
);
```

**멀티패러다임 접근의 이점**

1. **테스트 용이성**: 순수 함수는 독립적으로 테스트하기 쉽습니다.

   ```typescript
   // 순수 함수는 단위 테스트가 간단함
   describe("calculateItemTotalPrice", () => {
     it("should calculate total price with discount", () => {
       const item = { product: { price: 1000 }, quantity: 2 };
       const result = calculateItemTotalPrice(item, false);
       expect(result).toBe(2000);
     });
   });
   ```

   반면 `item.updateQuantity()` 같은 메서드는 React 상태 관리와 결합되어 있어 테스트가 복잡하지만, 내부에서 사용하는 순수 함수들은 쉽게 테스트할 수 있습니다.

2. **재사용성**: 순수 함수는 다양한 컨텍스트에서 재사용할 수 있습니다.

   ```typescript
   // 같은 순수 함수를 다양한 곳에서 사용 가능
   const itemTotal = calculateItemTotalPrice(item, bulkPurchase);
   const cartTotal = cart.reduce(
     (sum, item) => sum + calculateItemTotalPrice(item, bulkPurchase),
     0
   );
   ```

3. **가독성과 유지보수성의 균형**:

   - 사용하는 입장에서는 `item.updateQuantity(5)`처럼 객체지향의 이점을 누립니다.
   - 내부 구현에서는 `calculateItemTotalPrice(item, bulkPurchase)`처럼 순수 함수를 사용하여 로직이 명확하고 테스트하기 쉽습니다.

4. **책임 분리**:

   - 순수 함수는 "무엇을 계산하는가"에 집중 (비즈니스 로직)
   - 비순수 함수는 "어떻게 상태를 변경하는가"에 집중 (상태 관리)
   - 이렇게 분리하니 각 함수의 역할이 명확해지고, 비즈니스 로직을 변경할 때 상태 관리 코드를 건드릴 필요가 없습니다.

5. **디버깅 용이성**: 순수 함수는 입력과 출력이 명확하므로, 문제가 발생했을 때 어느 단계에서 문제가 생겼는지 추적하기 쉽습니다. 예를 들어 `totalPrice`가 잘못 계산되었다면, `calculateItemTotalPrice` 함수만 확인하면 됩니다.

**설계 철학**

이러한 멀티패러다임 접근은 다음과 같은 철학을 따릅니다:

- **외부 인터페이스는 객체지향**: 사용하는 입장에서는 객체의 메서드를 호출하는 것이 자연스럽고 읽기 쉽습니다.
- **내부 구현은 함수형**: 계산 로직은 순수 함수로 분리하여 테스트하고 재사용하기 쉽게 만듭니다.
- **명확한 경계**: 순수 함수와 비순수 함수를 명확히 구분하여, 각각의 장점을 최대한 활용합니다.

이렇게 하면 객체지향의 가독성과 함수형의 테스트 용이성, 재사용성을 모두 가져갈 수 있습니다.

### 과제를 하면서 내가 알게된 점, 좋았던 점은 무엇인가요?

- **멀티패러다임 프로그래밍의 가독성 효과**: 함수형, 객체지향, 선언적 프로그래밍을 적절히 조합하여 코드 가독성을 크게 향상시킬 수 있었습니다.

  - **함수형 패러다임 (순수 함수)**: `calculateItemTotalPrice`, `applyCouponToTotalPrice`, `getMaxApplicableDiscount` 같은 계산 로직을 순수 함수로 분리하니, 입력과 출력이 명확해서 함수만 봐도 "무엇을 하는지" 즉시 이해할 수 있었습니다. 사이드 이펙트가 없어서 테스트하기도 쉽고, 함수 이름만 봐도 역할을 파악할 수 있어 코드를 읽는 시간이 단축되었습니다.
  - **객체지향 패러다임 (엔티티 인스턴스)**: `CartItemInstance`, `ProductItemInstance`처럼 관련 데이터와 메서드를 하나의 객체로 묶으니, "장바구니 아이템을 수정한다"는 개념이 `item.updateQuantity()`, `item.delete()` 같은 메서드로 자연스럽게 표현되어 코드의 의도가 명확해졌습니다. 특히 `item.updateQuantity()`를 호출하는 코드를 보면 "이 아이템의 수량을 업데이트한다"는 의미가 바로 전달되어, 여러 파일을 오가며 로직을 추적할 필요가 없어졌습니다.
  - **선언적 패러다임 (React 컴포넌트)**: 컴포넌트가 "어떻게"가 아닌 "무엇을" 렌더링하는지에 집중하니, JSX만 봐도 UI 구조를 한눈에 파악할 수 있었습니다. 예를 들어 `<CartItemListSection items={cartItems} />`를 보면 "장바구니 아이템 목록을 보여준다"는 의도가 바로 드러나, 복잡한 DOM 조작 로직을 읽을 필요가 없어졌습니다.

- **Hook의 책임 분리**: 컴포넌트에서 비즈니스 로직을 분리하여 hook으로 옮기니 컴포넌트가 훨씬 깔끔해지고 테스트하기 쉬워졌습니다. 특히 상태를 관리하는 `useProductForm`, `useCouponForm` 같은 hook들은 폼 관련 로직이 한 곳에 모여있어 유지보수가 편했습니다.

- **Context를 통한 전역 상태 관리**: Context API를 사용하여 `CartContext`, `ProductsContext`, `CouponsContext`를 만들면서 props drilling 문제를 해결했습니다. 각 도메인별로 Context를 분리하여 관심사 분리도 잘 되었고, 컴포넌트 트리에서 어디서든 필요한 상태에 접근할 수 있어 코드가 간결해졌습니다.

- **도메인별 폴더 구조**: `domains/cart`, `domains/products`, `domains/coupon`으로 도메인별로 폴더를 나누니 코드를 찾기 쉽고 유지보수가 편해졌습니다. 각 도메인의 Context, utils, hooks가 한 곳에 모여있어 관련 코드를 빠르게 찾을 수 있었습니다.

### 이번 과제에서 내가 제일 신경 쓴 부분은 무엇인가요?

1. **서비스 객체 패턴을 통한 가독성 향상**: 각 도메인 엔티티(CartItem, Product 등)가 자신의 동작을 메서드로 가지는 인스턴스 객체를 제공하여, 코드의 의도를 명확하게 표현하고자 했습니다. `item.updateQuantity()`, `item.delete()`, `product.priceLabel()` 같은 메서드는 "이 엔티티가 자신의 동작을 수행한다"는 의미가 메서드 이름에 그대로 드러나, 함수형 접근(`updateCartItemQuantity(cart, itemId, ...)`)보다 훨씬 읽기 쉽고 이해하기 쉬웠습니다. 특히 컴포넌트에서 사용할 때 `onDelete: () => item.delete()` 같은 코드는 "이 아이템을 삭제한다"는 의도가 한눈에 들어와, 여러 파일을 오가며 로직을 추적할 필요가 없어졌습니다.

2. **멀티패러다임 프로그래밍을 통한 가독성 향상**:

   - **계산 로직은 순수 함수로**: `calculateItemTotalPrice(item, hasBulkPurchase)` 같은 함수는 입력만 받아 결과를 반환하므로, 함수 시그니처만 봐도 "장바구니 아이템과 대량 구매 여부를 받아 총액을 계산한다"는 의미가 명확합니다. 함수 내부를 읽지 않아도 역할을 파악할 수 있어 가독성이 향상되었습니다.
   - **엔티티 동작은 인스턴스 메서드로**: `item.updateQuantity(5)`를 보면 "이 아이템의 수량을 5로 업데이트한다"는 의미가 직관적으로 전달됩니다. 반면 함수형 스타일인 `updateCartItemQuantity(cart, itemId, 5)`보다 더 자연스럽고 읽기 쉬웠습니다. 특히 `item.delete()` 같은 메서드는 "이 아이템을 삭제한다"는 의도가 메서드 이름에 그대로 드러나 코드를 읽는 사람이 즉시 이해할 수 있었습니다.
   - **UI는 선언적으로**: `<CartItemListSection items={cartItems} />`처럼 컴포넌트를 선언적으로 사용하니, JSX만 봐도 "장바구니 아이템 목록을 보여준다"는 의도가 명확합니다. 복잡한 조건문이나 반복문을 읽을 필요 없이 구조를 한눈에 파악할 수 있어 가독성이 크게 향상되었습니다.

3. **Hook은 상태 관리가 있을 때만 사용**: 초기에는 모든 로직을 hook으로 분리하려 했지만, 상태를 관리하지 않는 단순 함수 호출(`usePurchase`, `useCouponSelection` 등)은 hook으로 만들 필요가 없다는 것을 깨달았습니다. 상태를 관리하는 `useProductForm`, `useCouponForm`만 hook으로 유지하니, hook의 역할이 명확해지고 코드가 더 간결해졌습니다.

4. **도메인 props vs UI props 구분**: 도메인 컴포넌트(`CartItem`, `ProductCard`)에는 도메인 관련 props만 남기고, Context를 통해 전역 상태를 직접 접근하여 불필요한 props drilling을 제거했습니다. 이렇게 하니 컴포넌트가 받는 props가 줄어들어 컴포넌트의 책임이 명확해졌습니다.

5. **계산 함수의 순수성**: 모든 계산 함수들이 사이드 이펙트 없이 입력에 대해 항상 같은 결과를 반환하도록 작성했습니다. 이렇게 하니 함수를 독립적으로 테스트할 수 있고, 함수의 역할을 이해하기 쉬워졌습니다.

### 이번 과제를 통해 앞으로 해보고 싶은게 있다면 알려주세요!

- **lodash, es-toolkit과 같은 유틸리티 라이브러리의 적극적인 사용**
  함수형 프로그래밍에 대해 찾아보다보니 es-toolkit이나 lodash와 같은 유틸리티 라이브러리를 사용하면 의미가 더 명확한 코드를 더 간결하게 작성할 수 있을 것 같았습니다. 이러한 유틸리티 라이브러리에서 주로 사용되는 함수들에 대해 공부하고 실무에서 더 폭 넓게 활용해보고 싶습니다.

### 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문 편하게 남겨주세요 :)

- **멀티패러다임 프로그래밍의 적절성**: 함수형(순수 함수), 객체지향(인스턴스 메서드), 선언적(React 컴포넌트) 패러다임을 함께 사용했는데, 각 패러다임을 언제 사용하는 것이 가장 적절한지 궁금합니다. 예를 들어 계산 로직은 순수 함수로, 엔티티의 동작은 인스턴스 메서드로 분리한 것이 가독성 측면에서 적절한 선택이었는지 의견이 궁금합니다. 특히, 각 도메인에 대한 훅이 service 객체를 제공함을 통해 객체지향의 이점을 가져와 사용하고자 하였는데 사용하는 입장에서 편리하다고 느껴지기는 하였으나 훅이 너무 거대하고 많은 역할을 하고 있는 것은 아닌 지 의문이 들기도 하였습니다.

- **Hook 분리 기준**: 컴포넌트에서 hook으로 로직을 분리할 때, 상태 관리가 없는 단순 함수 호출은 hook으로 만들지 않는 것이 맞다고 생각합니다. 하지만 데이터 변환 로직(`cart.list.map(...)`) 같은 경우는 컴포넌트에 두는 것이 맞는지, 아니면 별도의 함수로 분리하는 것이 맞는지 의견이 궁금합니다. 저는 우선 컴포넌트에 둔 경우가 많은데, 오히려 과도하게 분리하면 코드를 옮겨다니며 로직을 파악하는 게 어려워질 수 있다고 생각했기 때문입니다.
