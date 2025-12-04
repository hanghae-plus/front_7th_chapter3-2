# 📚 참고 자료

## 프로젝트 문서
- `README.md` - 과제 요구사항 및 상세 설명
- `.github/pull_request_template.md` - 체크리스트 및 회고 템플릿

## 핵심 개념

### 엔티티 vs 비엔티티 구분
| 구분 | 엔티티 O | 엔티티 X |
|------|---------|---------|
| 상태 | cart, isCartFull | isShowPopup |
| 컴포넌트/훅 | CartItemView, useCart() | Button, useRoute |
| 함수 | calculateCartTotal(cart) | capitalize(str) |

### 계층 구조
```
entities -> features -> UI
```

### 분리 기준
- **순수함수**: 특정 엔티티만 다루는 계산 로직
- **커스텀 훅**: 상태를 다루는 로직
- **컴포넌트**: UI 렌더링

## 체크리스트

### 기본과제
- [ ] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [ ] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [ ] 계산함수는 순수함수로 작성이 되었나요?
- [ ] 특정 Entity만 다루는 함수는 분리되어 있나요?
- [ ] 특정 Entity만 다루는 Component와 UI를 다루는 Component는 분리되어 있나요?
- [ ] 데이터 흐름에 맞는 계층구조를 이루고 의존성이 맞게 작성이 되었나요?

### 심화과제
- [ ] Context나 Jotai를 사용해서 전역상태관리를 구축했나요?
- [ ] 전역상태관리를 통해 domain custom hook을 적절하게 리팩토링 했나요?
- [ ] 도메인 컴포넌트에 도메인 props는 남기고 props drilling을 유발하는 불필요한 props는 잘 제거했나요?
- [ ] 전체적으로 분리와 재조립이 더 수월해진 결합도가 낮아진 코드가 되었나요?

## 기술 스택
- React 19
- TypeScript 5.9
- Vite 7
- Vitest 3 + React Testing Library
