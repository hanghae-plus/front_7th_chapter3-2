/**
 * Advanced 테스트를 위한 Zustand Store 초기화 설정
 *
 * Zustand는 전역 싱글톤이므로 테스트 간 상태 격리를 위해
 * 각 테스트 전에 모든 store를 초기화해야 합니다.
 */
import { beforeEach, afterEach, vi } from "vitest";
import { useCartStore } from "./store/useCartStore";
import { useProductStore } from "./store/useProductStore";
import { useCouponStore } from "./store/useCouponStore";
import { useNotificationStore } from "./store/useNotificationStore";

beforeEach(() => {
  // localStorage 초기화
  localStorage.clear();

  // Zustand store 초기화
  useCartStore.getState().reset();
  useProductStore.getState().reset();
  useCouponStore.getState().reset();
  useNotificationStore.getState().reset();

  // console 경고 무시
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

