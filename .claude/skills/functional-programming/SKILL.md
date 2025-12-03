---
name: fp-skill
description: |
  에릭 노먼드의 "쏙쏙 들어오는 함수형 코딩(Grokking Simplicity)" 철학 기반 코드 리뷰 및 리팩터링 전문가.
  사용자의 코드를 분석하여 액션(Action), 계산(Calculation), 데이터(Data)로 분류하고,
  복잡성을 낮추며 테스트 용이성과 유지보수성을 높이는 설계를 제안합니다.

  다음 상황에서 이 스킬을 사용하세요:
  (1) 코드의 부수 효과(Side Effect)를 줄이고 싶을 때
  (2) 전역 상태 의존성을 제거하고 싶을 때
  (3) 불변성(Immutability)을 적용하고 싶을 때
  (4) 액션에서 계산을 분리하는 리팩터링이 필요할 때
  (5) 계층형 설계(Stratified Design)를 적용하고 싶을 때
  (6) 고차 함수로 중복을 제거하고 싶을 때
  (7) 비동기/동시성 버그(경쟁 조건)를 해결하고 싶을 때
---

# Functional Coding Agent

에릭 노먼드의 "쏙쏙 들어오는 함수형 코딩(Grokking Simplicity)" 철학을 따르는 실용주의 함수형 프로그래밍 전문가입니다.

## 핵심 철학

> "설계란 코드를 분리하는 것이다 (Design is about pulling things apart)"

학술적 용어(모나드, 펑터) 대신 실용적 용어(계산, 액션, 카피-온-라이트)를 사용하여 **오늘 당장 적용 가능한** 함수형 기법을 제안합니다.

---

## 1. ACD 분류 체계

모든 코드는 세 가지로 분류됩니다:

| 분류            | 정의                  | 특징                                | 예시                                          |
| --------------- | --------------------- | ----------------------------------- | --------------------------------------------- |
| **Data**        | 이벤트에 대한 사실    | 실행 없이 알 수 있는 정적 정보      | `{ name: "Kim", price: 100 }`                 |
| **Calculation** | 입력 → 출력 순수 함수 | 실행 시점/횟수 무관, 항상 동일 결과 | `sum()`, `string_length()`                    |
| **Action**      | 부수 효과가 있는 코드 | 실행 시점/횟수에 의존               | `sendEmail()`, `saveDB()`, `getCurrentTime()` |

### 분류 판별 기준

```
코드가 다음 중 하나라도 해당하면 → Action
├── 외부 세계와 상호작용 (DB, API, 파일, 콘솔)
├── 전역 변수 읽기/쓰기
├── 현재 시간/날짜 사용
├── 랜덤 값 생성
└── 가변 데이터 수정

위에 해당하지 않으면:
├── 입력으로 출력을 만드는 함수 → Calculation
└── 단순한 값/구조체 → Data
```

### BAD vs GOOD: 액션에서 계산 분리하기

```javascript
// ❌ BAD: 모든 것이 하나의 액션에 뒤섞임
function add_item_to_cart(name, price) {
  // 암묵적 입력: 전역 변수 shopping_cart
  shopping_cart.push({ name, price }); // 가변 데이터 수정 (Action)

  // 비즈니스 로직이 액션 안에 숨어있음
  let total = 0;
  for (let item of shopping_cart) {
    total += item.price;
  }

  // 암묵적 출력: DOM 수정
  document.querySelector('.total').innerText = total;

  // 조건부 로직도 액션 안에
  if (total >= 20) {
    document.querySelector('.shipping').innerText = 'Free';
  }
}
```

```javascript
// ✅ GOOD: 계산을 추출하여 액션 최소화

// 📦 Data
const item = { name: 'shoes', price: 50 };

// 🧮 Calculation: 순수 함수들
function add_item(cart, item) {
  return [...cart, item]; // 새 배열 반환 (불변성)
}

function calc_total(cart) {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function gets_free_shipping(cart) {
  return calc_total(cart) >= 20;
}

// ⚡ Action: 최소화된 부수 효과
function add_item_to_cart(name, price) {
  const item = { name, price };
  shopping_cart = add_item(shopping_cart, item); // 유일한 상태 변경
  update_total_dom();
}

function update_total_dom() {
  const total = calc_total(shopping_cart);
  document.querySelector('.total').innerText = total;
  document.querySelector('.shipping').innerText = gets_free_shipping(
    shopping_cart
  )
    ? 'Free'
    : '$5';
}
```

**리팩터링 포인트:**

- 암묵적 입력(전역 변수) → 명시적 인자로 변환
- 암묵적 출력(DOM 수정) → 반환값으로 변환 (가능한 경우)
- 계산 로직을 별도 함수로 추출

---

## 2. 불변성 (Immutability)

### Copy-on-Write 패턴

가변 데이터를 다룰 때 3단계 규칙:

```
1. 복사본 만들기 (Make a copy)
2. 복사본 변경하기 (Modify the copy)
3. 복사본 리턴하기 (Return the copy)
```

### BAD vs GOOD: Copy-on-Write 적용

```javascript
// ❌ BAD: 원본 배열 직접 수정
function remove_item_by_name(cart, name) {
  const idx = cart.findIndex((item) => item.name === name);
  if (idx !== -1) {
    cart.splice(idx, 1); // 원본 수정!
  }
  return cart;
}

// 사용 시 문제 발생
const cart = [{ name: 'a' }, { name: 'b' }];
const newCart = remove_item_by_name(cart, 'a');
console.log(cart); // [{ name: 'b' }] - 원본도 변경됨!
console.log(newCart); // [{ name: 'b' }]
```

```javascript
// ✅ GOOD: Copy-on-Write 적용
function remove_item_by_name(cart, name) {
  const copy = cart.slice(); // 1. 복사본 만들기
  const idx = copy.findIndex((item) => item.name === name);
  if (idx !== -1) {
    copy.splice(idx, 1); // 2. 복사본 변경하기
  }
  return copy; // 3. 복사본 리턴하기
}

// 사용
const cart = [{ name: 'a' }, { name: 'b' }];
const newCart = remove_item_by_name(cart, 'a');
console.log(cart); // [{ name: 'a' }, { name: 'b' }] - 원본 유지!
console.log(newCart); // [{ name: 'b' }]
```

### Copy-on-Write 유틸리티 함수

```javascript
// 배열용 유틸리티
function removeItems(array, idx, count) {
  const copy = array.slice();
  copy.splice(idx, count);
  return copy;
}

function push(array, elem) {
  const copy = array.slice();
  copy.push(elem);
  return copy;
}

// 객체용 유틸리티
function objectSet(object, key, value) {
  const copy = { ...object };
  copy[key] = value;
  return copy;
}

function objectDelete(object, key) {
  const copy = { ...object };
  delete copy[key];
  return copy;
}
```

### 방어적 복사 (Defensive Copying)

신뢰할 수 없는 코드(레거시, 외부 라이브러리)와 상호작용할 때:

```javascript
// ❌ BAD: 외부 라이브러리에 직접 전달
function processWithLegacyLib(data) {
  legacyLib.process(data); // 라이브러리가 data를 변경할 수도 있음!
  return data;
}

// ✅ GOOD: 방어적 복사 적용
function processWithLegacyLib(data) {
  // 들어갈 때: 깊은 복사 후 전달
  const inputCopy = structuredClone(data);
  const result = legacyLib.process(inputCopy);

  // 나올 때: 결과도 깊은 복사
  return structuredClone(result);
}
```

---

## 3. 계층형 설계 (Stratified Design)

코드를 변경 빈도에 따라 계층으로 분리:

```
┌─────────────────────────────────────┐
│  비즈니스 규칙 (자주 변경)          │  gets_free_shipping()
├─────────────────────────────────────┤
│  도메인 규칙 (가끔 변경)            │  calc_total(), add_item()
├─────────────────────────────────────┤
│  일반 유틸리티 (거의 안 변경)       │  push(), objectSet()
├─────────────────────────────────────┤
│  언어/런타임 (변경 없음)            │  Array.slice(), spread operator
└─────────────────────────────────────┘
```

### 패턴 1: 직접 구현 (Straightforward Implementation)

함수 내부 코드의 추상화 수준을 일관되게 유지:

```javascript
// ❌ BAD: 추상화 수준이 뒤섞임
function freeTieClip(cart) {
  let hasTie = false;
  let hasTieClip = false;

  // 저수준: 배열 순회
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name === 'tie') hasTie = true;
    if (cart[i].name === 'tie clip') hasTieClip = true;
  }

  if (hasTie && !hasTieClip) {
    // 저수준: 배열 복사 + 추가
    const copy = cart.slice();
    copy.push({ name: 'tie clip', price: 0 });
    return copy;
  }
  return cart;
}

// ✅ GOOD: 일관된 추상화 수준
function freeTieClip(cart) {
  if (isInCart(cart, 'tie') && !isInCart(cart, 'tie clip')) {
    return add_item(cart, make_item('tie clip', 0));
  }
  return cart;
}

// 도우미 함수들 (한 단계 낮은 추상화)
function isInCart(cart, name) {
  return cart.some((item) => item.name === name);
}

function make_item(name, price) {
  return { name, price };
}

function add_item(cart, item) {
  return [...cart, item];
}
```

### 패턴 2: 추상화 벽 (Abstraction Barrier)

세부 구현을 감추는 인터페이스 계층:

```javascript
// 추상화 벽: 장바구니 내부 구조를 감춤
// 상위 계층은 장바구니가 배열인지 객체인지 몰라도 됨

// --- 추상화 벽 (장바구니 API) ---
function add_item(cart, item) {
  return { ...cart, [item.name]: item }; // 객체로 구현
}

function remove_item(cart, name) {
  const copy = { ...cart };
  delete copy[name];
  return copy;
}

function isInCart(cart, name) {
  return cart.hasOwnProperty(name);
}

function calc_total(cart) {
  return Object.values(cart).reduce((sum, item) => sum + item.price, 0);
}

// --- 상위 계층: 내부 구현 몰라도 됨 ---
function freeTieClip(cart) {
  if (isInCart(cart, 'tie') && !isInCart(cart, 'tie clip')) {
    return add_item(cart, make_item('tie clip', 0));
  }
  return cart;
}
```

---

## 4. 일급 추상 (First-Class Abstraction)

### 암묵적 인자 → 명시적 인자

```javascript
// ❌ BAD: 함수 이름에 필드명이 하드코딩
function setPriceByName(cart, name, price) {
  return cart.map((item) => (item.name === name ? { ...item, price } : item));
}

function setQuantityByName(cart, name, quantity) {
  return cart.map((item) =>
    item.name === name ? { ...item, quantity } : item
  );
}

function setShippingByName(cart, name, shipping) {
  return cart.map((item) =>
    item.name === name ? { ...item, shipping } : item
  );
}

// ✅ GOOD: 필드명을 인자로 추출
function setFieldByName(cart, name, field, value) {
  return cart.map((item) =>
    item.name === name ? { ...item, [field]: value } : item
  );
}

// 사용
setFieldByName(cart, 'shoes', 'price', 100);
setFieldByName(cart, 'shoes', 'quantity', 2);
setFieldByName(cart, 'shoes', 'shipping', 'express');
```

### 함수 본문을 콜백으로 (Replace Body with Callback)

```javascript
// ❌ BAD: Copy-on-Write 로직이 반복됨
function arraySet(array, idx, value) {
  const copy = array.slice();
  copy[idx] = value;
  return copy;
}

function push(array, elem) {
  const copy = array.slice();
  copy.push(elem);
  return copy;
}

function drop_last(array) {
  const copy = array.slice();
  copy.pop();
  return copy;
}

// ✅ GOOD: 공통 로직을 고차 함수로 추출
function withArrayCopy(array, modify) {
  const copy = array.slice();
  modify(copy);
  return copy;
}

// 사용
const arraySet = (array, idx, value) =>
  withArrayCopy(array, (copy) => {
    copy[idx] = value;
  });

const push = (array, elem) =>
  withArrayCopy(array, (copy) => {
    copy.push(elem);
  });

const drop_last = (array) =>
  withArrayCopy(array, (copy) => {
    copy.pop();
  });
```

### 함수를 반환하는 함수

```javascript
// ❌ BAD: try-catch가 여러 곳에서 반복
function saveUserData(user) {
  try {
    saveToDatabase(user);
  } catch (error) {
    logToSnapErrors(error);
  }
}

function fetchProducts() {
  try {
    return callAPI('/products');
  } catch (error) {
    logToSnapErrors(error);
  }
}

// ✅ GOOD: 로깅 래퍼 함수 생성
function wrapLogging(fn) {
  return function (...args) {
    try {
      return fn(...args);
    } catch (error) {
      logToSnapErrors(error);
    }
  };
}

// 사용
const saveUserDataSafe = wrapLogging(saveToDatabase);
const fetchProductsSafe = wrapLogging(() => callAPI('/products'));
```

---

## 5. 타임라인 격리 및 조율

### 문제: 경쟁 조건 (Race Condition)

```javascript
// ❌ BAD: 빠른 더블클릭 시 버그 발생
let shopping_cart = [];
let cart_total = 0;

function add_item_to_cart(item) {
  shopping_cart = add_item(shopping_cart, item);
  calc_cart_total(); // 비동기 호출
}

function calc_cart_total() {
  // 타임라인 1
  cost_ajax(shopping_cart, function (cost) {
    // 서버 요청
    // 타임라인 2 (응답 후)
    cart_total = cost;
    update_total_dom(cart_total);
  });
}

// 문제 시나리오:
// 1. 클릭1 → cart_total 계산 시작 (서버 요청)
// 2. 클릭2 → cart_total 계산 시작 (서버 요청)
// 3. 클릭2 응답 도착 → cart_total = 200
// 4. 클릭1 응답 도착 → cart_total = 100  ← 잘못된 값!
```

### 해결책 1: 지역 변수로 격리

```javascript
// ✅ GOOD: 전역 변수를 지역 변수로
function calc_cart_total(cart) {
  // cart는 함수 인자로 전달받음 (격리됨)
  cost_ajax(cart, function (cost) {
    // 각 호출마다 독립적인 cart 사용
    update_total_dom(cost);
  });
}
```

### 해결책 2: Queue로 순서 보장

```javascript
// ✅ GOOD: 작업 큐로 순서 보장
function Queue(worker) {
  const queue_items = [];
  let working = false;

  function runNext() {
    if (working || queue_items.length === 0) return;
    working = true;
    const item = queue_items.shift();
    worker(item.data, function (result) {
      working = false;
      item.callback(result);
      runNext();
    });
  }

  return function (data, callback) {
    queue_items.push({ data, callback });
    setTimeout(runNext, 0);
  };
}

// 사용
const calc_cart_total_queue = Queue(cost_ajax);

function add_item_to_cart(item) {
  shopping_cart = add_item(shopping_cart, item);
  calc_cart_total_queue(shopping_cart, update_total_dom);
}
```

---

## 응답 가이드라인

### 코드 분석 시

1. **먼저 ACD 분류**: 각 함수/코드 블록을 Action, Calculation, Data로 분류
2. **근거 제시**: "이 코드는 액션입니다. 왜냐하면 전역 변수 `shopping_cart`를 읽기 때문입니다."
3. **리팩터링 우선순위**: 액션에서 계산을 분리하는 방안을 최우선으로 제안

### 리팩터링 제안 시

```
1. 암묵적 입력 → 명시적 인자로 변환
2. 암묵적 출력 → 반환값으로 변환
3. Copy-on-Write 적용
4. 고차 함수로 중복 제거
5. 계층 분리 (추상화 수준 맞추기)
```

### 사용할 용어

| 사용 ✅            | 대신 ❌                     |
| ------------------ | --------------------------- |
| 액션 (Action)      | 불순 함수 (Impure function) |
| 계산 (Calculation) | 순수 함수 (Pure function)   |
| 카피-온-라이트     | 불변성 패턴                 |
| 암묵적 입력/출력   | 부수 효과 (Side effect)     |
| 계층형 설계        | 클린 아키텍처               |

---

## 참고 자료

- 원서: "Grokking Simplicity" by Eric Normand
- GitHub: https://github.com/ericnormand/grokking-simplicity-code
- 공식 사이트: https://grokkingsimplicity.com
