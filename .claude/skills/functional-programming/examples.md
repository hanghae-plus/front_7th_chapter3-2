# 함수형 코딩 상세 예제 모음

"쏙쏙 들어오는 함수형 코딩" 책의 상세 예제들입니다.

---

## 1. MegaMart 쇼핑몰 예제 (책의 메인 예제)

### 초기 코드 (문제가 많은 버전)

```javascript
// ❌ BAD: 전형적인 명령형 코드
var shopping_cart = [];
var shopping_cart_total = 0;

function add_item_to_cart(name, price) {
  shopping_cart.push({
    name: name,
    price: price,
  });
  calc_cart_total();
}

function calc_cart_total() {
  shopping_cart_total = 0;
  for (var i = 0; i < shopping_cart.length; i++) {
    var item = shopping_cart[i];
    shopping_cart_total += item.price;
  }
  set_cart_total_dom();
  update_shipping_icons();
  update_tax_dom();
}

function update_shipping_icons() {
  var buy_buttons = get_buy_buttons_dom();
  for (var i = 0; i < buy_buttons.length; i++) {
    var button = buy_buttons[i];
    var item = button.item;
    if (item.price + shopping_cart_total >= 20)
      button.show_free_shipping_icon();
    else button.hide_free_shipping_icon();
  }
}

function update_tax_dom() {
  set_tax_dom(shopping_cart_total * 0.1);
}
```

**문제점 분석:**

1. 전역 변수 `shopping_cart`, `shopping_cart_total` 사용 (암묵적 입력/출력)
2. `add_item_to_cart`가 너무 많은 일을 함 (장바구니 수정 + 총액 계산 + DOM 업데이트)
3. 비즈니스 로직(20달러 이상 무료배송)이 DOM 코드와 섞여있음
4. 테스트 불가능 (DOM 의존성)

### 리팩터링 1단계: 암묵적 입력/출력 제거

```javascript
// ✅ GOOD: 계산 추출
function add_item(cart, name, price) {
  var new_cart = cart.slice(); // Copy-on-Write
  new_cart.push({
    name: name,
    price: price,
  });
  return new_cart;
}

function calc_total(cart) {
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    total += item.price;
  }
  return total;
}

function gets_free_shipping(total, item_price) {
  return item_price + total >= 20;
}

function calc_tax(amount) {
  return amount * 0.1;
}
```

### 리팩터링 2단계: 액션 최소화

```javascript
// ✅ GOOD: 액션은 부수 효과만 담당
var shopping_cart = [];

function add_item_to_cart(name, price) {
  shopping_cart = add_item(shopping_cart, name, price);
  var total = calc_total(shopping_cart);
  set_cart_total_dom(total);
  update_shipping_icons(shopping_cart);
  update_tax_dom(total);
}

function update_shipping_icons(cart) {
  var total = calc_total(cart);
  var buttons = get_buy_buttons_dom();
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    var item = button.item;
    if (gets_free_shipping(total, item.price)) button.show_free_shipping_icon();
    else button.hide_free_shipping_icon();
  }
}

function update_tax_dom(total) {
  set_tax_dom(calc_tax(total));
}
```

### 리팩터링 3단계: 함수 시그니처 개선

```javascript
// ✅ BETTER: 인자 수 줄이기
function gets_free_shipping(cart) {
  return calc_total(cart) >= 20;
}

// 특정 아이템 추가 후 무료배송 여부 확인
function gets_free_shipping_with_item(cart, item) {
  var new_cart = add_item(cart, item.name, item.price);
  return gets_free_shipping(new_cart);
}
```

---

## 2. Copy-on-Write 상세 패턴

### 읽기-쓰기 분리

JavaScript의 `Array.shift()`는 읽기와 쓰기를 동시에 수행:

```javascript
// ❌ BAD: shift()는 원본을 수정하면서 값을 반환
var array = [1, 2, 3];
var first = array.shift();
// first = 1, array = [2, 3] (원본 변경됨!)
```

```javascript
// ✅ GOOD: 두 가지 방법으로 분리

// 방법 1: 함수를 둘로 분리
function first_element(array) {
  return array[0];
}

function drop_first(array) {
  var copy = array.slice();
  copy.shift();
  return copy;
}

// 방법 2: 두 값을 함께 반환
function shift(array) {
  var copy = array.slice();
  var first = copy.shift();
  return {
    first: first,
    array: copy,
  };
}

// 사용
var result = shift([1, 2, 3]);
console.log(result.first); // 1
console.log(result.array); // [2, 3]
```

### 중첩 데이터 업데이트

```javascript
// ❌ BAD: 중첩 객체 직접 수정
function setQuantity(cart, name, quantity) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].quantity = quantity; // 원본 수정!
    }
  }
  return cart;
}
```

```javascript
// ✅ GOOD: update 함수 사용
function update(object, key, modify) {
  var value = object[key];
  var newValue = modify(value);
  return objectSet(object, key, newValue);
}

function objectSet(object, key, value) {
  var copy = Object.assign({}, object);
  copy[key] = value;
  return copy;
}

// 중첩 데이터용
function nestedUpdate(object, keys, modify) {
  if (keys.length === 0) {
    return modify(object);
  }
  var key = keys[0];
  var restOfKeys = keys.slice(1);
  return update(object, key, function (value) {
    return nestedUpdate(value, restOfKeys, modify);
  });
}

// 사용 예: cart.items[0].quantity 업데이트
var newCart = nestedUpdate(cart, ['items', 0, 'quantity'], function (q) {
  return q + 1;
});
```

---

## 3. 고차 함수 패턴

### forEach, map, filter, reduce 직접 구현

```javascript
// forEach
function forEach(array, fn) {
  for (var i = 0; i < array.length; i++) {
    fn(array[i]);
  }
}

// map
function map(array, fn) {
  var result = [];
  forEach(array, function (item) {
    result.push(fn(item));
  });
  return result;
}

// filter
function filter(array, predicate) {
  var result = [];
  forEach(array, function (item) {
    if (predicate(item)) {
      result.push(item);
    }
  });
  return result;
}

// reduce
function reduce(array, init, fn) {
  var accum = init;
  forEach(array, function (item) {
    accum = fn(accum, item);
  });
  return accum;
}
```

### 함수형 파이프라인 (Chaining)

```javascript
// ❌ BAD: 중첩된 함수 호출
var result = map(filter(map(customers, getFullName), isValidName), toLowerCase);

// ✅ GOOD: 체이닝 가능한 구조
function pipeline(value, ...fns) {
  return reduce(fns, value, function (accum, fn) {
    return fn(accum);
  });
}

// 사용
var result = pipeline(
  customers,
  function (arr) {
    return map(arr, getFullName);
  },
  function (arr) {
    return filter(arr, isValidName);
  },
  function (arr) {
    return map(arr, toLowerCase);
  }
);

// 또는 curry된 버전으로
var result = pipeline(
  customers,
  map_(getFullName),
  filter_(isValidName),
  map_(toLowerCase)
);
```

### Curry 패턴

```javascript
function curry(fn) {
  return function (arg1) {
    return function (arg2) {
      return fn(arg1, arg2);
    };
  };
}

// map을 curry로 변환
function map_(fn) {
  return function (array) {
    return map(array, fn);
  };
}

function filter_(predicate) {
  return function (array) {
    return filter(array, predicate);
  };
}
```

---

## 4. 이벤트 소싱 패턴

```javascript
// 이벤트 로그로 상태 재구성
var events = [
  { type: 'add', item: { name: 'shoes', price: 100 } },
  { type: 'add', item: { name: 'shirt', price: 50 } },
  { type: 'remove', name: 'shoes' },
  { type: 'add', item: { name: 'hat', price: 30 } },
];

function applyEvent(cart, event) {
  switch (event.type) {
    case 'add':
      return add_item(cart, event.item);
    case 'remove':
      return remove_item_by_name(cart, event.name);
    default:
      return cart;
  }
}

function buildCart(events) {
  return reduce(events, [], applyEvent);
}

var finalCart = buildCart(events);
// [{ name: 'shirt', price: 50 }, { name: 'hat', price: 30 }]
```

---

## 5. 동시성 기본형

### DroppingQueue (최신 요청만 처리)

```javascript
function DroppingQueue(max, worker) {
  var queue = [];
  var working = false;

  function runNext() {
    if (working || queue.length === 0) return;
    working = true;

    var item = queue.shift();
    worker(item.data, function (result) {
      working = false;
      item.callback(result);
      runNext();
    });
  }

  return function (data, callback) {
    // 큐가 가득 차면 가장 오래된 것 제거
    while (queue.length >= max) {
      queue.shift();
    }
    queue.push({ data: data, callback: callback });
    setTimeout(runNext, 0);
  };
}

// 사용: 자동 검색 (타이핑 중 최신 입력만 검색)
var searchQueue = DroppingQueue(1, performSearch);
```

### Cut (병렬 작업 조율)

```javascript
function Cut(num, callback) {
  var num_finished = 0;
  return function () {
    num_finished += 1;
    if (num_finished === num) {
      callback();
    }
  };
}

// 사용: 3개의 비동기 작업이 모두 완료되면 실행
var done = Cut(3, function () {
  console.log('All done!');
});

fetch('/api/users').then(done);
fetch('/api/products').then(done);
fetch('/api/orders').then(done);
```

---

## 6. React/Next.js 적용 예제

### 상태 관리에 Copy-on-Write 적용

```typescript
// ❌ BAD: 직접 상태 수정
function CartComponent() {
  const [cart, setCart] = useState<Item[]>([]);

  const addItem = (item: Item) => {
    cart.push(item); // 직접 수정!
    setCart(cart); // 리렌더링 안 됨!
  };
}

// ✅ GOOD: Copy-on-Write
function CartComponent() {
  const [cart, setCart] = useState<Item[]>([]);

  const addItem = (item: Item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeItem = (name: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== name));
  };

  const updateQuantity = (name: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === name ? { ...item, quantity } : item
      )
    );
  };
}
```

### 계산 분리 (Custom Hook)

```typescript
// 계산을 분리한 커스텀 훅
function useCart() {
  const [cart, setCart] = useState<Item[]>([]);

  // 🧮 Calculations (순수 함수)
  const calcTotal = useCallback(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const getsFreeShipping = useCallback(() => calcTotal() >= 20, [calcTotal]);

  const calcTax = useCallback(() => calcTotal() * 0.1, [calcTotal]);

  // ⚡ Actions (상태 변경만)
  const addItem = useCallback((item: Item) => {
    setCart((prev) => [...prev, item]);
  }, []);

  const removeItem = useCallback((name: string) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  }, []);

  return {
    cart,
    calcTotal,
    getsFreeShipping,
    calcTax,
    addItem,
    removeItem,
  };
}
```

### TanStack Query와 함께 사용

```typescript
// 계산과 액션의 분리
function useProductCart(productId: string) {
  const queryClient = useQueryClient();

  // 📦 Data: 서버에서 가져오기
  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
  });

  // 🧮 Calculation: 순수 함수
  const calculateDiscount = (price: number, discount: number) =>
    price * (1 - discount / 100);

  // ⚡ Action: 서버 상태 변경
  const addToCartMutation = useMutation({
    mutationFn: (item: CartItem) => addToCartAPI(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    product,
    calculateDiscount,
    addToCart: addToCartMutation.mutate,
  };
}
```

---

## 7. 계층형 설계 TypeScript 예제

```typescript
// 계층 1: 언어 유틸리티 (가장 안정적)
function objectSet<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): T {
  return { ...obj, [key]: value };
}

function arrayPush<T>(arr: T[], item: T): T[] {
  return [...arr, item];
}

// 계층 2: 일반 도메인 유틸리티
interface Item {
  name: string;
  price: number;
  quantity: number;
}

function addItem(cart: Item[], item: Item): Item[] {
  return arrayPush(cart, item);
}

function removeItemByName(cart: Item[], name: string): Item[] {
  return cart.filter((item) => item.name !== name);
}

function calcTotal(cart: Item[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// 계층 3: 비즈니스 규칙 (가장 자주 변경)
const FREE_SHIPPING_THRESHOLD = 20;
const TAX_RATE = 0.1;

function getsFreeShipping(cart: Item[]): boolean {
  return calcTotal(cart) >= FREE_SHIPPING_THRESHOLD;
}

function calcTax(cart: Item[]): number {
  return calcTotal(cart) * TAX_RATE;
}

function applyMemberDiscount(cart: Item[], discountRate: number): Item[] {
  return cart.map((item) => ({
    ...item,
    price: item.price * (1 - discountRate),
  }));
}
```
