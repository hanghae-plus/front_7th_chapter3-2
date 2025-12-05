# CLAUDE.md

ALWAYS RESPOND IN KOREAN
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React educational project focused on refactoring patterns, functional programming, and state management design (Chapter 3-2: 디자인 패턴과 함수형 프로그래밍 그리고 상태 관리 설계). The project demonstrates refactoring a monolithic component into well-structured, maintainable code following Single Responsibility Principle (SRP).

## Development Commands

### Running the Application
- `npm run dev:origin` - Run the original unrefactored version
- `npm run dev:basic` - Run the basic refactored version (without state management library)
- `npm run dev:advanced` - Run the advanced version (with state management to solve props drilling)

### Testing
- `npm test` - Run all tests
- `npm run test:origin` - Test only origin version
- `npm run test:basic` - Test only basic version
- `npm run test:advanced` - Test only advanced version
- `npm run test:ui` - Run tests with Vitest UI

### Build & Lint
- `npm run build` - TypeScript compilation and Vite build
- `npm run lint` - ESLint with TypeScript and React rules
- `npm run lint:fix` - Auto-fix ESLint issues (converts relative to absolute imports)
- `npm run format` - Format code with Prettier and organize imports

## Project Structure Philosophy

The codebase follows a layered architecture with clear separation of concerns:

### Three Implementation Levels

1. **origin/** - Monolithic component (all logic in one file)
2. **basic/** - Refactored with hooks and utils, NO state management library
3. **advanced/** - Further refactored with state management (Context/Jotai/Zustand) to eliminate props drilling

### Architectural Layers

The refactoring demonstrates proper separation across these layers:

#### Entity vs Non-Entity Separation
- **Entity-related**: Components, hooks, and functions that work with business entities (Product, Cart, Coupon)
  - State: `cart`, `products`, `coupons` (vs UI state like `isShowPopup`)
  - Components: `ProductCard`, `CartItemView` (vs generic UI like `Button`)
  - Hooks: `useCart()`, `useProduct()`, `useCoupon()` (vs `useRoute()`, `useEvent()`)
  - Functions: `calculateCartTotal(cart)` (vs `capitalize(str)`)

- **Non-Entity**: Generic utilities and UI components without business logic

#### Required Refactoring Structure (from requirements)

**1. Calculation Functions** (models/)
- `calculateItemTotal` - Calculate individual item total with discounts
- `getMaxApplicableDiscount` - Determine applicable discount rate
- `calculateCartTotal` - Calculate entire cart total
- `updateCartItemQuantity` - Update cart item quantities

**2. Hooks**
- Entity hooks: `useCart`, `useProduct`, `useCoupon`
- Utility hooks: `useLocalStorage`, `useDebounce`, `useValidate`

**3. Component Hierarchy**
- Entity components: `ProductCard`, `Cart`, `CartPage`, `AdminPage`
- UI components: Reusable presentation components
- Layout components: `Header`, structural elements

## Key Implementation Notes

### Path Aliases
- Use `@/` prefix for absolute imports (configured in vite.config.ts)
- ESLint enforces no relative imports: `'no-relative-import-paths/no-relative-import-paths'`

### State Management Constraint
- **basic/**: Must NOT use state management libraries (Context/Jotai/Zustand)
- **advanced/**: Should use one of: React Context, Jotai, or Zustand to solve props drilling

### Application Features

**Shopping Cart Page**:
- Product listing with name, price, stock, discounts
- Out-of-stock indication and cart blocking
- Cart quantity management with discount rate display
- Coupon application affecting final price
- Order summary showing pre-discount, total discount, and final price

**Admin Page**:
- Product CRUD (create, read, update, delete)
- Discount management (add/modify/delete by quantity thresholds)
- Coupon creation with amount or percentage discount types

### Test Requirements
All refactored code must pass the existing test suite in `src/basic/__tests__/origin.test.tsx` and `src/advanced/__tests__/origin.test.tsx`. Tests verify:
- Product search with debouncing
- Cart operations (add, update quantity, remove)
- Discount calculations
- Coupon application
- Admin operations

### refactoring(hint) Directory
Contains skeleton code with TODO comments and hints for the refactoring exercise. This serves as a reference structure for students.

## Core Entities

```typescript
Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

Discount {
  quantity: number;  // Minimum quantity for discount
  rate: number;      // Discount rate (0-1)
}

CartItem {
  product: Product;
  quantity: number;
}

Coupon {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
```

## Refactoring Goals

The exercise teaches:
1. Understanding React's philosophy and SRP violations in monolithic components
2. Distinguishing between entity and UI concerns
3. Separating data, state, and business logic
4. Creating appropriate custom hooks and utility functions
5. Building proper component hierarchies
6. Managing props drilling with state management solutions (advanced level)
