[구조 변경]
- FSD 폴더 구조 초기화 (shared, entities, widgets)
- 공통 타입과 유틸리티 함수를 `shared` 레이어로 이동

[Entities]
- `ProductCard` UI 생성 및 도메인 로직(재고 확인) 캡슐화
- 장바구니 계산 로직을 `entities/cart/lib`으로 분리

[Widgets]
- `Header` 위젯 추출: UI 렌더링과 상태 분리
- `ProductList` 위젯 추출: 목록 렌더링 및 검색 결과 없음 처리 분리
- `CartSidebar` 위젯 추출: 자율적인 가격 계산 로직 구현

[리팩토링]
- App.tsx의 원시 JSX 코드를 위젯 컴포넌트 조합으로 교체
- 애플리케이션 전체의 가격 표기 방식 표준화
- UI 컴포넌트의 TSX 확장자 관련 에러 수정

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

- [ ] Context나 Jotai를 사용해서 전역상태관리를 구축했나요?
- [ ] 전역상태관리를 통해 domain custom hook을 적절하게 리팩토링 했나요?
- [ ] 도메인 컴포넌트에 도메인 props는 남기고 props drilling을 유발하는 불필요한 props는 잘 제거했나요?
- [ ] 전체적으로 분리와 재조립이 더 수월해진 결합도가 낮아진 코드가 되었나요?


## 과제 셀프회고

### 리팩토링 청사진

이번 리팩토링의 핵심은 **수직적 분리** 와 **수평적 분리** 를 통해 입체적인 코드 구조를 만드는 것입니다.

### 수직적 분리 (레이어 위계)

```
Widgets (조립)
   ↓
Features (액션)
   ↓
Entities (데이터)
   ↓
Shared (공통)
```

상위 레이어만 하위 레이어를 참조할 수 있는 **단방향 의존성 규칙** 을 세워 데이터 흐름을 통제했습니다.

### 수평적 분리 (내부 역할)

각 폴더 내부에서 책임을 다시 분리합니다:

```
feature/cart/
├── ui/          # 사용자 액션 (View)
├── model/       # 상태 관리 (State)
└── lib/         # 순수 계산 (Logic)
```

이는 함수형 프로그래밍의 **"데이터와 로직의 분리"** 원칙을 파일 시스템에 적용한 것입니다.

### 입체적 메트릭스

수직과 수평을 조합하면, 코드의 위치만으로도 **"어떤 계층의, 어떤 역할"** 인지 즉시 파악할 수 있습니다:

- `widgets/ProductList/ui` → 상위 레이어의 UI 조립
- `features/cart/model` → 중간 레이어의 상태 관리
- `entities/cart/lib` → 하위 레이어의 순수 계산 로직

이 구조는 파일 경로 자체가 명세서 역할을 합니다.

### 시행착오: 수평적 분리에 대한 오해

처음에는 FSD의 레이어 구조만 이해했습니다. 그래서 단순히
- Entities = 데이터
- Features = 액션
- Shared = 계산

이렇게 함수형 프로그래밍의 3단계 분리(데이터, 계산, 액션)와 1:1로 매핑된다고 생각했습니다.

**하지만 이건 잘못된 이해였습니다.**

<img width="822" height="420" alt="image" src="https://github.com/user-attachments/assets/a1569610-d79c-46c4-be0b-60b5589888cf" />
<img width="822" height="420" alt="image" src="https://github.com/user-attachments/assets/25512028-a3fe-4565-9265-858708bb5329" />
<img width="822" height="420" alt="image" src="https://github.com/user-attachments/assets/84828cf7-611e-48c2-80a6-93f0e843ed35" />
<img width="822" height="218" alt="image" src="https://github.com/user-attachments/assets/0ad98f25-5c25-4e47-a4aa-8359bcd2a139" />


영서님과의 대화를 통해 깨달은 것은:

- **수직적 분리(Layer)**: '권력(의존성)'을 기준으로 나눈다
  - 누가 누구를 참조할 수 있는가?
  
- **수평적 분리(Slice)**: '주제(도메인)'를 기준으로 나눈다
  - product, cart, user 등

- **내부 분리(Segment)**: '직무(역할)'를 기준으로 나눈다
  - ui, model, lib 등

코드를 분리할 때는 **"이건 어떤 Layer의 어떤 Slice에 있는 어떤 Segment가 해야 할 일인지"** 를 생각하면 됩니다.

예를 들어, 장바구니 총합 계산 로직은:
- Layer: `entities` (데이터 레이어)
- Slice: `cart` (장바구니 도메인)
- Segment: `lib` (순수 계산 로직)
→ `entities/cart/lib/calculateCartTotal.ts`

FSD 설계 + 함수형 프로그래밍은 **3차원 좌표계** 처럼 코드의 정확한 위치를 지정하는 시스템같다고 느껴졌습니다.

### 설계 의사결정 과정
폴더 구조의 큰 틀은 FSD 공식 문서와 레퍼런스를 통해 파악했지만, 실제로 중요한 것은 **"어떤 설계를 선택할 것인가"** 에 대한 의사결정이었습니다.

예를 들어:
- `calculateCartTotal` 로직을 `entities/cart/lib`에 둘 것인가, `shared/lib`에 둘 것인가?
- `ProductCard`의 재고 확인 로직은 컴포넌트 내부에 둘 것인가, 별도 lib로 분리할 것인가?
- `onAddToCart` 핸들러는 어느 레이어가 소유해야 하는가?

이런 질문들은 정답이 명확하지 않았고, 각 선택마다 트레이드오프가 있었습니다.
[함수형 프로그래밍 블로그](https://velog.io/@teo/functional-programming) 와 [FSD 설계 블로그](https://velog.io/@teo/fsd)를 정독한 후 →
- 특정 도메인에 강하게 결합된 로직은 해당 Entity에 두는 것이 응집도가 높다
- 범용적으로 쓰이는 유틸리티만 Shared로 올린다
- Feature 레이어 없이 Entity가 액션을 소유하면 재사용성이 떨어진다

이런 인사이트를 얻을 수 있었고, **설계 결정의 타당성을 검증** 할 수 있었습니다.

결국 좋은 아키텍처는 폴더를 어떻게 나누느냐의 문제가 아니라, **"왜 이렇게 나눴는가"를 설명할 수 있는가** 의 문제라는 것을 배웠습니다.


---


### 과제를 하면서 내가 알게된 점, 좋았던 점은 무엇인가요?

## FSD 패턴: 폴더 구조가 곧 명세서다 [Screaming Architecture]

로버트 C. 마틴(Uncle Bob)이 주창한 "Screaming Architecture" 개념이 있습니다.

> "프로젝트의 폴더 구조를 봤을 때, '우리는 리액트를 씁니다!'라고 소리치지 말고, '우리는 쇼핑몰입니다!'라고 소리쳐야 한다."

### 기술이 아닌 비즈니스가 보여야 한다

**기존 구조:**

```
src/
├── components/
├── hooks/
├── utils/
└── contexts/
```

이 구조는 "우리는 리액트를 씁니다!"라고 소리칩니다.

- 컴포넌트를 쓰는구나
- 훅을 쓰는구나
- 컨텍스트를 쓰는구나

**하지만 정작 중요한 질문에는 답하지 못합니다:**

- 이게 쇼핑몰인가요? SNS인가요? 투두리스트인가요?
- 어떤 기능이 있나요?
- 어떤 데이터를 다루나요?

**FSD 구조:**

```
src/
📦advanced
 ┣ 📂entities           # [평민] 비즈니스 데이터 모델 & 순수 계산 (Domain Model)
 ┃ ┃                    # * 원칙: 데이터 구조와 순수 함수만 존재. 상태(State)나 액션(Action)을 모름.
 ┃ ┣ 📂cart             # ┗ 장바구니 도메인
 ┃ ┃ ┣ 📂lib            #   ┗ 계산 로직 (calculateCartTotal - 순수 함수)
 ┃ ┃ ┗ 📂model          #   ┗ 타입 정의 (CartItem)
 ┃ ┣ 📂coupon           # ┗ 쿠폰 도메인
 ┃ ┃ ┣ 📂lib            #   ┗ 검증 로직 (canApplyCoupon - 순수 함수)
 ┃ ┃ ┗ 📂model          #   ┗ 타입 정의 (Coupon)
 ┃ ┗ 📂product          # ┗ 상품 도메인
 ┃ ┃ ┣ 📂lib            #   ┗ 재고 파악 (getRemainingStock - 순수 함수)
 ┃ ┃ ┣ 📂model          #   ┗ 타입 정의 (ProductWithUI)
 ┃ ┃ ┗ 📂ui             #   ┗ 멍청한 컴포넌트 (ProductCard - 데이터 표시 전용)
 ┣ 📂features           # [귀족] 사용자 액션 & 상태 관리 (User Actions & State)
 ┃ ┃                    # * 원칙: 사용자의 '행동(Verb)'을 담당. Entity와 Shared를 사용하여 비즈니스 가치 창출.
 ┃ ┣ 📂app              # ┗ 앱 전반을 아우르는 통합 기능
 ┃ ┃ ┗ 📜useShop.ts     #   ┗ Facade Hook (모든 Feature Hook을 하나로 묶는 배선반)
 ┃ ┣ 📂cart             # ┗ 장바구니 기능 슬라이스
 ┃ ┃ ┗ 📂model          #   ┗ useCart (담기, 삭제, 수량 변경 로직)
 ┃ ┣ 📂coupon           # ┗ 쿠폰 기능 슬라이스
 ┃ ┃ ┣ 📂model          #   ┗ useCoupons (쿠폰 CRUD 로직)
 ┃ ┃ ┗ 📂ui             #   ┗ CouponManagementForm (쿠폰 입력 및 검증 UI)
 ┃ ┗ 📂product          # ┗ 상품 기능 슬라이스
 ┃ ┃ ┗ 📂model          #   ┗ 상품 관련 상태 및 로직
 ┃ ┃ ┃ ┣ 📂ui           #     ┗ ProductManagementForm (상품 입력 폼 UI)
 ┃ ┃ ┃ ┣ 📜useProductFilter.ts # ┗ 검색 및 필터링 로직
 ┃ ┃ ┃ ┣ 📜useProductForm.ts   # ┗ 폼 상태 관리 (Headless Logic)
 ┃ ┃ ┃ ┗ 📜useProducts.ts      # ┗ 상품 CRUD 및 저장소 동기화
 ┣ 📂shared             # [도구] 도메인을 모르는 범용 유틸리티 & 인프라 (Infrastructure)
 ┃ ┃                    # * 원칙: 프로젝트 전반에서 쓰이는 공용 도구. 비즈니스 로직(쇼핑몰)을 전혀 모름.
 ┃ ┣ 📂lib              # ┗ 범용 함수 및 커스텀 훅
 ┃ ┃ ┣ 📜format.ts          #   ┗ 포맷터 (순수 함수)
 ┃ ┃ ┣ 📜useDebounce.ts     #   ┗ UI 최적화 (시간 지연)
 ┃ ┃ ┣ 📜useLocalStorage.ts #   ┗ 저장소 추상화 (인프라 격리)
 ┃ ┃ ┣ 📜useNotification.ts #   ┗ 알림 로직 (삭제 예정 혹은 레거시 호환)
 ┃ ┃ ┗ 📜useNotificationSystem.ts # ┗ 개선된 알림 시스템 로직
 ┃ ┣ 📂model            # ┗ 범용 데이터 모델
 ┃ ┃ ┗ 📜types.ts           #   ┗ Notification 등 시스템 공용 타입
 ┃ ┗ 📂ui               # ┗ 범용 UI 컴포넌트
 ┃ ┃ ┗ 📜NotificationSystem.ts #   ┗ 알림 메시지 렌더러 (순수 UI)
 ┣ 📂widgets            # [조립] 화면을 구성하는 독립적인 UI 블록 (Composition)
 ┃ ┃                    # * 원칙: Entity와 Feature를 조립하여 완성된 덩어리를 만듦.
 ┃ ┣ 📂AdminDashboard   # ┗ 관리자 패널 위젯
 ┃ ┃ ┗ 📂ui
 ┃ ┃ ┃ ┣ 📜CouponListGrid.tsx   # ┗ (Sub) 쿠폰 목록 그리드
 ┃ ┃ ┃ ┣ 📜ProductListTable.tsx # ┗ (Sub) 상품 목록 테이블
 ┃ ┃ ┃ ┗ 📜index.tsx            # ┗ 위젯 진입점 (조립 및 상태 연결)
 ┃ ┣ 📂CartSidebar      # ┗ 장바구니 사이드바 위젯
 ┃ ┃ ┗ 📂ui             #   ┗ (결제 정보 포함)
 ┃ ┣ 📂Header           # ┗ 헤더 위젯
 ┃ ┃ ┗ 📂ui             #   ┗ (네비게이션, 카트 아이콘)
 ┃ ┗ 📂ProductList      # ┗ 상품 목록 위젯
 ┃ ┃ ┗ 📂ui             #   ┗ (검색 결과 표시)
 ┣ 📂__tests__          # 테스트 코드
 ┃ ┗ 📜origin.test.tsx  # ┗ 통합 테스트 (E2E 시나리오 검증)
 ┣ 📜App.tsx            # [왕/페이지] 레이어 조립 및 데이터 주입 (Wiring)
 ┃                      # * 원칙: 로직 없음. Feature Hooks(useShop)를 호출하고 Widget에 주입하는 역할.
 ┗ 📜main.tsx           # 앱 진입점
```

이 구조는 "우리는 쇼핑몰입니다!"라고 소리칩니다.

- 상품이 있구나
- 장바구니가 있구나
- 쿠폰을 적용할 수 있구나
- 결제 기능이 있구나

**폴더 이름만 봐도 기획서의 목차가 보입니다.**

FSD는 기술 스택이 아닌 비즈니스 도메인이 앞으로 나옵니다.

## 레이어 자체가 기능 명세서

FSD의 각 폴더는 기획서의 섹션과 정확히 매칭됩니다.

| FSD 레이어 | 기획서/명세서의 항목 | 우리 프로젝트의 실제 폴더 (예시) |
|------------|---------------------|--------------------------------|
| Pages | 사이트맵 / 라우팅 | App.tsx (현재 메인) |
| Widgets | 와이어프레임 (UI 블록) | widgets/Header, widgets/ProductList, widgets/CartSidebar, widgets/AdminDashboard |
| Features | 유저 스토리 (비즈니스 액션) | features/cart (담기/수량변경), features/product (상품 CRUD), features/coupon (쿠폰 적용) |
| Entities | 도메인 모델 (데이터 구조) | entities/product (ProductCard, 재고파악), entities/cart (가격계산) |
| Shared | 인프라 / 공통 규약 | shared/model (types.ts), shared/lib (format.ts, useNotification) |

특히 `features` 폴더는 그 자체로 "이 애플리케이션이 수행할 수 있는 동작 목록"입니다.

신규 입사자가 왔을 때, 두꺼운 위키 문서를 던져주는 것보다 `src/features` 폴더를 열어보라고 하는 게 훨씬 빠르고 정확합니다.

## 강제된 의존성 규칙이 곧 설계도

일반적인 프로젝트에서는 개발자마다 "이 코드를 어디에 둘까?"에 대한 기준이 달라 스파게티가 되기 쉽습니다. 하지만 FSD는 **상위 레이어만 하위 레이어를 참조할 수 있다**는 엄격한 규칙이 있습니다.

이 규칙 자체가 "코드의 흐름도" 역할을 합니다:

- Widget을 보면 → "아, 이 기능(Feature)과 저 데이터(Entity)를 조립했구나."
- Feature를 보면 → "아, 이 데이터(Entity)를 조작하는구나."

폴더 위치만으로도 데이터의 흐름과 의존 관계를 파악할 수 있습니다. 폴더구조가 하나의 명세로 사용된다는 게 신기하고 충격이었습니다.

---

## FSD 리팩토링: "어디에 둘까?"를 결정한 5가지 원칙

리팩토링을 진행하면서 가장 어려웠던 건 **"이 코드를 어느 폴더에 넣을까?"** 였습니다.  
수십 개의 파일을 재배치하면서, 저는 5가지 질문을 스스로에게 던졌습니다.

---

## 1. "이 코드가 세상을 바꾸는가?" (액션 vs 계산의 분리)

### 함수형 프로그래밍의 제1원칙

가장 먼저 적용한 기준입니다. 코드를 볼 때마다 자문했습니다.

**질문:**  
> "이 함수를 100번 실행하면 외부 세상(DB, 화면, 전역변수)에 영향을 미치는가?"

**분리 기준:**

- **NO (순수함):** 입력만 같으면 결과가 늘 같고, 아무것도 안 건드린다.  
  → **lib (Entities/Shared)** 으로 격리
  - 예: `calculateCartTotal`, `formatCurrency`, `canApplyCoupon`

- **YES (부수효과):** 상태를 바꾸거나(`setState`), 저장하거나(`localStorage`), 화면을 그린다.  
  → **model (Hook) 또는 ui (Component)** 에 남김
  - 예: `addToCart`, `useLocalStorage`

**왜 중요한가?**  
순수 함수는 테스트하기 쉽고, 재사용하기 좋고, 버그가 적습니다.  
lib 폴더만 열면 "아, 이건 믿고 쓸 수 있는 계산기구나"라는 안도감이 들어야 합니다.

---

## 2. "이 코드는 '쇼핑몰'이라는 사실을 아는가?" (도메인 지식 유무)

### FSD 레이어 결정 기준

코드가 비즈니스(도메인)와 얼마나 끈끈한지 따졌습니다.

**질문:**  
> "이 코드를 떼어내서 '투두 리스트' 앱에 가져가면 에러 없이 작동하는가?"

**분리 기준:**

- **YES (작동함):** 도메인을 모르는 멍청한 도구다.  
  → **Shared**
  - 예: `useLocalStorage` (저장만 함), `useDebounce` (시간만 끔), `formatCurrency` (숫자만 바꿈)

- **NO (에러남):** '상품', '쿠폰' 같은 단어를 알아야 한다.  
  → **Entities / Features**
  - 예: `ProductCard`, `useCart`

**왜 중요한가?**  
Shared는 다른 프로젝트에서도 복붙할 수 있는 "범용 인프라"입니다.  
반면 Entities/Features는 "이 쇼핑몰만의 고유한 지식"입니다.  
이 경계가 명확해야 코드를 재사용하거나 교체하기 쉬워집니다.

---

## 3. "책임이 너무 무겁지 않은가?" (단일 책임 원칙)

### 컴포넌트 분할 기준

`AdminDashboard`나 `App.tsx`를 찢을 때 적용한 기준입니다.

**질문:**  
> "이 컴포넌트가 변경되어야 하는 이유가 2개 이상인가?"

**분리 기준:**

- `App.tsx`는 "라우팅/배치"가 바뀌면 수정되어야 하는데, "검색 로직" 때문에도 수정되어야 했다.  
  → **분리 대상**

- `AdminDashboard`는 "레이아웃" 때문에 수정되어야 하는데, "상품 입력 폼의 유효성 검사" 때문에도 수정되어야 했다.  
  → **ProductManagementForm**으로 분리

**왜 중요한가?**  
하나의 파일이 여러 이유로 수정되면, 팀원들끼리 Git 충돌이 나고, 버그 수정 시 예상치 못한 부분이 깨집니다.  
"한 가지 이유로만 변경되는 파일"은 안전하고 예측 가능합니다.

---

## 4. "구현(How)인가, 의도(What)인가?" (추상화 레벨)

### 훅(Hook) 분리 기준

`useCart` 내부를 정리할 때 쓴 기준입니다.

**질문:**  
> "이 코드가 '무엇을 하는지' 설명하는가, '어떻게 하는지' 구구절절 설명하는가?"

**분리 기준:**

- **Before:** `localStorage.getItem('cart')... JSON.parse...`  
  → 이건 "어떻게(How)"에 집착하는 저수준 코드

- **Action:** 저수준 코드를 `useLocalStorage`로 숨김

- **After:** `const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);`  
  → "저장한다(What)"는 의도만 남김  
  → **비즈니스 로직이 선명해짐**

**왜 중요한가?**  
비즈니스 로직에 `JSON.parse`, `try-catch` 같은 저수준 코드가 섞이면 "진짜 중요한 로직"이 묻힙니다.  
추상화를 통해 "쿠폰을 적용한다", "장바구니에 담는다" 같은 **비즈니스 언어** 만 남겨야 합니다.

---

## 5. "자주 함께 바뀌는가?" (응집도)

### 파일 위치 선정 기준

타입(`types.ts`)을 찢어서 각 폴더에 넣을 때 쓴 기준입니다.

**질문:**  
> "Product 타입이 바뀌면 누가 가장 괴로운가?"

**분리 기준:**

- `Product` 타입이 바뀌면 `ProductCard`와 `useProducts`가 괴롭다.  
  → 그들 곁(`entities/product`)에 둔다. **(Co-location)**

- 서로 관련 없는 코드들이 한 파일(`shared/types.ts`)에 모여 있으면, 하나 고칠 때마다 깃 충돌(Conflict)만 난다.  
  → **찢는다**

**왜 중요한가?**  
"함께 변경되는 것은 함께 둔다"는 원칙은 개발 속도를 올립니다.  
`Product` 관련 코드를 수정할 때, `entities/product` 폴더만 열면 모든 게 거기 있습니다.  
여러 폴더를 헤매지 않아도 됩니다.

---

## ⚡ 5가지 원칙 요약표

| 상황 | 질문 | 결정 (Action) |
|------|------|---------------|
| **로직** | 결과가 늘 같은가? | ✅ → `lib` (순수함수)<br>❌ → `hook` (액션) |
| **위치** | 쇼핑몰인 걸 아는가? | ✅ → `Entities/Features`<br>❌ → `Shared` |
| **UI** | 역할이 2개 이상인가? | ✅ → 하위 컴포넌트로 분리 (Form, List) |
| **상태** | 구체적 구현인가? | ✅ → 커스텀 훅으로 추상화 (`useLocalStorage`) |
| **데이터** | 누구랑 친한가? | 친한 놈 옆방(`model`)으로 이동 |

---

## 마치며

이 5가지 질문은 **"코드를 어디에 둘까?"** 라는 과제에서의 고민을 비교적 쉽게 해결해주었습니다.

처음엔 답이 명확하지 않았지만, 원칙을 반복 적용하다 보니  
이제는 코드를 보는 순간 "아, 이건 `entities/product/lib`에 가야겠네"라는 직감이 생겼습니다.
물론 이게 가장 좋은 방법이라고 말한 순 없지만, 저만의 기준을 근거로 삼고, 근거를 통해 분리를 하니 복잡했던 컴포넌트가 많이 정리된 것 같습니다. 


### 이번 과제에서 내가 제일 신경 쓴 부분은 무엇인가요?

### 이번 과제를 통해 앞으로 해보고 싶은게 있다면 알려주세요!

### 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문 편하게 남겨주세요 :)
