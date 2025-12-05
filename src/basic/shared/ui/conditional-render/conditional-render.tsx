import React from 'react';

interface ConditionalRenderProps {
  /**
   * 렌더링 조건
   * true일 때 children을 렌더링하고, false일 때 fallback을 렌더링합니다.
   */
  condition: boolean;
  /**
   * condition이 false일 때 렌더링될 컴포넌트
   */
  fallback?: React.ReactNode;
  /**
   * condition이 true일 때 렌더링될 컴포넌트
   */
  children: React.ReactNode;
}

/**
 * 선언적인 조건부 렌더링 컴포넌트
 *
 * @example
 * ```tsx
 * <ConditionalRender
 *   condition={cart.length > 0}
 *   fallback={<EmptyCart />}
 * >
 *   <CartList items={cart} />
 * </ConditionalRender>
 * ```
 */
export function ConditionalRender({
  condition,
  fallback = null,
  children,
}: ConditionalRenderProps) {
  return <>{condition ? children : fallback}</>;
}
