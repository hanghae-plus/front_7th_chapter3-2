# 🎯 프로젝트 목표

## 최종 목표
React 쇼핑몰 앱의 비즈니스 로직을 분리하고 계층 구조를 이해하는 리팩토링

## Phase 1: 기본과제 (basic)
상태관리 없이 hook/function 분리

### 세부 태스크

#### 1) 계산 함수 분리 (순수함수)
- [ ] `calculateItemTotal` - 아이템 총액 계산
- [ ] `getMaxApplicableDiscount` - 최대 적용 가능 할인율
- [ ] `calculateCartTotal` - 장바구니 총액 계산
- [ ] `updateCartItemQuantity` - 장바구니 수량 업데이트

#### 2) 커스텀 훅 분리
- [ ] `useCart` - 장바구니 상태 관리
- [ ] `useCoupons` - 쿠폰 상태 관리
- [ ] `useProducts` - 상품 상태 관리
- [ ] `useLocalStorage` - 로컬 스토리지 유틸리티

#### 3) 컴포넌트 계층 구조
- [ ] 엔티티 컴포넌트와 UI 컴포넌트 분리
- [ ] ProductCard, Cart 등 컴포넌트 분리

#### 4) 테스트 통과
- [ ] `pnpm test:basic` 통과

## Phase 2: 심화과제 (advanced)
Context 또는 Jotai로 Props drilling 제거

### 세부 태스크
- [ ] 전역 상태관리 구축 (Context/Jotai/Zustand 중 선택)
- [ ] 도메인 커스텀 훅 리팩토링
- [ ] 불필요한 props 제거
- [ ] `pnpm test:advanced` 통과

## 성공 기준
- [ ] 모든 테스트 통과 (`pnpm test`)
- [ ] Component에서 비즈니스 로직 분리 완료
- [ ] 계산함수는 순수함수로 작성
- [ ] 특정 Entity만 다루는 함수/컴포넌트 분리
- [ ] 데이터 흐름에 맞는 계층구조
