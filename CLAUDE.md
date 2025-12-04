# Project Context

This is a React shopping cart refactoring project for Hanghae Plus Chapter 3-2.

## Project Goal

Refactor a monolithic React component (`src/origin/App.tsx`) into a well-structured, layered architecture following:
- Single Responsibility Principle (SRP)
- Functional Programming (Action/Calculation/Data separation)
- Practical React design patterns

## Project Structure

```
src/
├── origin/          ← Original code (DO NOT modify)
├── basic/           ← Refactor WITHOUT state management library
├── advanced/        ← Refactor WITH state management library
├── refactoring(hint)/ ← Reference implementation
└── types.ts         ← Shared type definitions
```

## Key Entities

- `Product`: id, name, price, stock, discounts
- `CartItem`: product, quantity
- `Coupon`: name, code, discountType, discountValue
- `Discount`: quantity, rate

---

## Subagents & Skills

### When to Use Subagents

| Task | Subagent |
|------|----------|
| Full refactoring of cart application | `cart-refactoring-expert` |
| General FE architecture analysis | `fe-architecture-expert` |

### When to Use Skills

| Task | Skill |
|------|-------|
| Extract `calculateItemTotal`, `getMaxApplicableDiscount`, `calculateCartTotal` | `cart-calculation` |
| Create `useCart`, `useProducts`, `useCoupons`, `useLocalStorage` hooks | `entity-hooks` |
| Separate `ProductCard`, `Cart`, `CartItem` components | `component-hierarchy` |
| General component design patterns | `component-design` |
| General hook design patterns | `hook-design` |
| General state management | `state-management` |
| General refactoring process | `refactoring` |

---

## Refactoring Requirements

### 1. Calculation Functions (Pure Functions)

Extract to `utils/` directory:
- `calculateItemTotal(item: CartItem): number`
- `getMaxApplicableDiscount(item: CartItem): number`
- `calculateCartTotal(cart: CartItem[], coupon: Coupon | null): CartTotal`
- `updateCartItemQuantity(cart: CartItem[], productId: string, quantity: number): CartItem[]`

### 2. Custom Hooks (Entity Hooks)

Extract to `hooks/` directory:
- `useCart` - cart state and operations
- `useProducts` - product CRUD operations
- `useCoupons` - coupon management
- `useLocalStorage` - localStorage persistence utility

### 3. Component Hierarchy

Separate to `components/` directory:
- Container components (use hooks, manage state)
- Presenter components (receive props, pure rendering)
- UI components (no entity knowledge)

---

## Core Principles

### Action/Calculation/Data Separation

| Type | Description | Examples |
|------|-------------|----------|
| **Data** | Facts about events | `props`, `state`, server response |
| **Calculation** | Pure functions (no side effects) | `calculateItemTotal`, `getMaxApplicableDiscount` |
| **Action** | Side effects, timing-dependent | API calls, `useEffect`, DOM manipulation |

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Pages / App                 │  ← Composition only
├─────────────────────────────────────┤
│     Container Components            │  ← Connect hooks to presenters
├─────────────────────────────────────┤
│     Presenter Components            │  ← Pure rendering
├─────────────────────────────────────┤
│     Custom Hooks                    │  ← State + business logic
├─────────────────────────────────────┤
│     Calculation Functions (Utils)   │  ← Pure functions (testable)
├─────────────────────────────────────┤
│     Types / Models                  │  ← Type definitions
└─────────────────────────────────────┘
```

### Entity vs Non-Entity Classification

| Entity-related | Non-Entity |
|----------------|------------|
| `cart`, `products`, `coupons` | `isAdmin`, `isModalOpen` |
| `useCart()`, `useProducts()` | `useDebounce()`, `useLocalStorage()` |
| `ProductCard`, `CartItem` | `Button`, `Input`, `Modal` |
| `calculateCartTotal(cart)` | `formatPrice(num)` |

---

## Commands

```bash
# Run tests (basic)
pnpm test:basic

# Run tests (advanced)
pnpm test:advanced

# Development
pnpm dev
```

## Test Files

- `src/basic/__tests__/origin.test.tsx`
- `src/advanced/__tests__/origin.test.tsx`

All refactored code must pass the existing tests.

---

## Workflow Guidelines

1. **Before refactoring**: Read the original code in `src/origin/App.tsx`
2. **Extract calculations first**: Move pure functions to utils
3. **Extract hooks second**: Create entity hooks with proper separation
4. **Extract components last**: Separate container/presenter pattern
5. **Run tests**: Verify all tests pass after each step
6. **No state management library for basic**: Use only React hooks
