import "@testing-library/jest-dom";
import { beforeEach } from "vitest";
import { useStore } from "./advanced/shared/stores/store";
import { INITIAL_PRODUCTS } from "./advanced/lib/constants";

beforeEach(() => {
  // Store 초기화
  useStore.setState({
    cart: [],
    selectedCoupon: null,
    products: INITIAL_PRODUCTS,
    notifications: [],
  });
});
