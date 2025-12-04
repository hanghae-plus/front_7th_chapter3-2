# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- 항상 한글로 대화할 것
- 유저의 질문에 답변할 때, 도움이 되는 MCP(Model Context Protocol) 도구가 있다면 반드시 활용할 것 (예: context7로 라이브러리 문서 조회, sequential-thinking으로 복잡한 문제 분석 등)
- **코드 구현은 유저가 명시적으로 요청할 때만 진행할 것**
- 주요 역할: 남은 태스크를 추적하고, 순차적으로 해결할 수 있도록 태스크 관리

## Context Management

**Lazy Loading 전략**:

1. 이 파일 먼저 읽기 (인덱스)
2. 필요시 `.claude/` 하위 파일 참조
3. 상태는 `.claude/state/`에서 확인

## Setup Trigger

| 명령어 | 동작 |
|--------|------|
| `@setup` | 초기화 시작 |
| `@reset` | 상태 초기화 |
| `@goal [목표]` | 목표 업데이트 |
| `@status` | 현재 진행 상황 |
| `@agent [cmd]` | 에이전트 관리 |

**초기화 가이드**: `SETTING.md` 참조

## Project Overview

React 쇼핑몰 앱의 비즈니스 로직을 분리하고 계층 구조를 이해하는 리팩토링 과제

**목표**: `.claude/state/goals.md` 참조
**참고자료**: `.claude/state/references.md` 참조

### 구현 대상

- **basic**: 상태관리 없이 hook/function 분리
- **advanced**: Context 또는 Jotai로 Props drilling 제거

## Agent System

**레지스트리**: `.claude/agents/_registry.md`

### 활성 에이전트

- orchestrator (01) - 전체 조율
- code-writer (04) - 코드 구현
- reviewer (05) - 코드 리뷰

### 에이전트 호출 규칙

- Task tool 사용 시 반드시 에이전트 규칙 인라인 포함
- 에이전트 정의: `.claude/agents/[name].md`

## Mandatory Logging

### NEVER

- 로그 없이 페이즈 종료 금지
- progress.json 갱신 없이 다음 페이즈 금지

### 페이즈 완료 시 필수

1. `.claude/state/logs/phase-[n].md` 작성
2. `.claude/state/progress.json` 업데이트
3. 완료 메시지 출력

## Development

```bash
# Development
pnpm dev:origin      # 원본 구현 (참고용)
pnpm dev:basic       # 기본과제
pnpm dev:advanced    # 심화과제

# Testing
pnpm test            # 전체 테스트
pnpm test:basic      # 기본과제 테스트
pnpm test:advanced   # 심화과제 테스트

# Build & Lint
pnpm build
pnpm lint
```

## Tech Stack

- React 19
- TypeScript 5.9
- Vite 7
- Vitest 3 + React Testing Library
- jsdom

## Architecture

### Core Types (`src/types.ts`)

- `Product`: id, name, price, stock, discounts[]
- `Discount`: quantity, rate
- `CartItem`: product, quantity
- `Coupon`: name, code, discountType, discountValue

### Target Structure (basic)

```
src/basic/
├── App.tsx
├── components/
│   ├── AdminPage.tsx
│   ├── CartPage.tsx
│   └── ui/
├── hooks/
│   ├── useCart.ts
│   ├── useCoupons.ts
│   ├── useProducts.ts
│   └── useLocalStorage.ts
├── models/
│   ├── cart.ts      # 순수 함수
│   ├── coupon.ts
│   └── product.ts
└── utils/
    └── formatters.ts
```

### Key Business Logic

- 수량별 할인: 10개 이상 10%, 20개 이상 20% 등
- 대량 구매 보너스: 10개 이상 구매 시 추가 5% (최대 50%)
- 쿠폰: 정액(amount) 또는 정률(percentage)

---

**Lines**: < 150
