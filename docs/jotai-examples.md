# Jotai 기본 사용법 예제

Jotai는 React의 `useState`처럼 간단하게 사용할 수 있는 원자(Atom) 기반의 상태 관리 라이브러리입니다.

---

### 1. `atom` 생성: 상태의 최소 단위 만들기

가장 먼저, 상태를 담을 '원자(atom)'를 만들어야 합니다. atom은 애플리케이션 어디서든 접근할 수 있는 상태의 한 조각입니다.

`src/atoms.ts` 와 같은 파일을 만들어 atom들을 관리하는 것이 일반적입니다.

```typescript
// src/atoms.ts
import { atom } from 'jotai';

// 1. 가장 기본적인 atom (원시 값)
export const counterAtom = atom(0); // 초기값은 0

// 2. 객체를 담는 atom
export const userAtom = atom({ name: 'John Doe', age: 30 });

// 3. 배열을 담는 atom
export const cartAtom = atom([]); // 초기값은 빈 배열
```

### 2. `useAtom` 훅: 컴포넌트에서 상태 사용하기

`useAtom`은 React의 `useState`와 거의 똑같이 생겼습니다. atom을 인자로 받아, `[상태 값, 업데이트 함수]` 배열을 반환합니다.

```tsx
// src/components/Counter.tsx
import { useAtom } from 'jotai';
import { counterAtom } from '../atoms';

const Counter = () => {
  // useState와 사용법이 동일합니다.
  const [count, setCount] = useAtom(counterAtom);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(c => c - 1)}>-1</button>
    </div>
  );
};
```

`Counter` 컴포넌트와 다른 어떤 컴포넌트가 `counterAtom`을 사용하든, 둘은 항상 같은 상태를 공유하게 됩니다.

### 3. 읽기 전용(Read-Only) atom과 파생(Derived) atom

다른 atom의 값을 조합하여 새로운 값을 만들어내는 '파생 atom'을 만들 수 있습니다. 이는 매우 강력한 기능입니다.

```typescript
// src/atoms.ts
import { atom } from 'jotai';

export const productsAtom = atom([
  { id: 1, name: 'Apple', price: 1 },
  { id: 2, name: 'Orange', price: 2 },
]);

// 읽기 전용(Read-only) 파생 atom
// productsAtom의 값을 읽어서 총 가격을 계산합니다.
export const totalPriceAtom = atom((get) => {
  const products = get(productsAtom);
  return products.reduce((total, product) => total + product.price, 0);
});
```

컴포넌트에서는 `totalPriceAtom`을 `useAtom`으로 구독하기만 하면, `productsAtom`이 변경될 때마다 총 가격이 자동으로 다시 계산되어 렌더링됩니다.

```tsx
// src/components/TotalPrice.tsx
import { useAtom } from 'jotai';
import { totalPriceAtom } from '../atoms';

const TotalPrice = () => {
  // 파생 atom은 업데이트 함수가 없으므로, 값만 받아옵니다.
  const [total] = useAtom(totalPriceAtom);

  return <div>Total Price: ${total}</div>;
};
```

### 4. 쓰기 전용(Write-Only) atom

상태를 직접 갖지는 않지만, 다른 atom들을 업데이트하는 로직을 정의할 수 있습니다.

```typescript
// src/atoms.ts
import { atom } from 'jotai';

// ... (productsAtom 정의)

// 쓰기 전용(Write-only) atom
// 첫 번째 인자는 읽기 함수(get), 두 번째 인자는 쓰기 함수(set)입니다.
// 세 번째 인자는 업데이트할 때 받을 값(payload)입니다.
export const addProductAtom = atom(
  null, // 읽기 함수는 사용하지 않으므로 null
  (get, set, newProduct) => {
    // 현재 productsAtom의 값을 가져와서 새로운 상품을 추가한 뒤,
    // set 함수로 productsAtom의 상태를 업데이트합니다.
    const currentProducts = get(productsAtom);
    set(productsAtom, [...currentProducts, newProduct]);
  }
);
```

컴포넌트에서는 이 atom을 사용하여 상품을 추가할 수 있습니다.

```tsx
// src/components/AddProductForm.tsx
import { useAtom } from 'jotai';
import { addProductAtom } from '../atoms';

const AddProductForm = () => {
  // 쓰기 전용 atom은 상태 값이 없으므로 첫 번째 인자는 무시합니다.
  const [, addProduct] = useAtom(addProductAtom);

  const handleSubmit = () => {
    const newProduct = { id: Date.now(), name: 'New Fruit', price: 3 };
    addProduct(newProduct);
  };

  return <button onClick={handleSubmit}>Add Product</button>;
};
```

이 예제들이 Jotai의 핵심 기능을 이해하는 데 도움이 될 것입니다. 이제 이 개념들을 우리 프로젝트에 적용해 볼 차례입니다.
