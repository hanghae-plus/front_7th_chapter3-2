import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, Coupon, Product } from "../../../../types";
import { useLocalStorage } from "../../../shared/hooks/useLocalStorage";
import { sumBy } from "../../../shared/utils/sum";
import { iife } from "../../../shared/utils/iife";
import { hasBulkPurchase } from "../utils/hasBulkPurchase";
import { calculateItemTotalPrice } from "../utils/calculateItemTotal";
import { applyCouponToTotalPrice } from "../utils/applyCoupon";
import { getMaxApplicableDiscount } from "../utils/getMaxApplicableDiscount";
import { getRemainingStock } from "../utils/getRemainingStock";

type CartItemInstance = CartItem & {
  totalPrice: number;
  discountRate: number;
  remainingStock: number;
  updateQuantity: (newQuantity: number) => boolean;
  delete: () => void;
};

export type CartContextValue = {
  list: CartItemInstance[];
  hasBulkPurchase: boolean;
  totalItemCount: number;
  purchaseInfo: {
    originalTotalPrice: number;
    discountedTotalPrice: number;
    discountAmount: number;
  };
  selectedCoupon: Coupon | null;
  getById: (productId: string) => CartItemInstance | undefined;
  addItem: (product: Product) => void;
  selectCoupon: (coupon: Coupon) => void;
  clearCoupon: () => void;
  purchase: () => string;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (cart.length === 0) {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const bulkPurchase = useMemo(() => hasBulkPurchase(cart), [cart]);

  const totalItemCount = useMemo(
    () => sumBy(cart, (item) => item.quantity),
    [cart]
  );

  const cartInstance: CartItemInstance[] = useMemo(
    () =>
      cart.map((item, idx) => ({
        ...item,
        totalPrice: calculateItemTotalPrice(item, bulkPurchase),
        discountRate: Math.round(
          getMaxApplicableDiscount(item, bulkPurchase) * 100
        ),
        remainingStock: getRemainingStock(item),
        updateQuantity: (newQuantity: number) => {
          if (newQuantity < 0) return false;
          if (newQuantity > item.product.stock) return false;

          setCart((prev) => {
            const next = [...prev];
            if (newQuantity === 0) {
              return next.filter((_, i) => i !== idx);
            }

            next[idx].quantity = newQuantity;
            return next;
          });

          return true;
        },
        delete: () => {
          setCart((prev) => prev.filter((_, i) => i !== idx));
        },
      })),
    [cart, bulkPurchase, setCart]
  );

  const purchaseInfo = useMemo(
    () =>
      iife(() => {
        const originalTotalPrice = sumBy(
          cart,
          (item) => item.product.price * item.quantity
        );

        const discountedTotalPrice = iife(() => {
          const totalPrice = sumBy(cart, (item) =>
            calculateItemTotalPrice(item, bulkPurchase)
          );

          return applyCouponToTotalPrice(totalPrice, selectedCoupon);
        });

        const discountAmount = originalTotalPrice - discountedTotalPrice;

        return {
          originalTotalPrice,
          discountedTotalPrice,
          discountAmount,
        };
      }),
    [cart, bulkPurchase, selectedCoupon]
  );

  const getById = useCallback(
    (productId: string) => {
      return cartInstance.find((item) => item.product.id === productId);
    },
    [cartInstance]
  );

  const addItem = useCallback(
    (product: Product) => {
      setCart((prev) => [...prev, { product, quantity: 1 }]);
    },
    [setCart]
  );

  const selectCoupon = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon);
  }, []);

  const clearCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const purchase = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    setCart([]);
    setSelectedCoupon(null);
    return orderNumber;
  }, [setCart]);

  const value: CartContextValue = useMemo(
    () => ({
      list: cartInstance,
      hasBulkPurchase: bulkPurchase,
      totalItemCount,
      purchaseInfo,
      selectedCoupon,
      getById,
      addItem,
      selectCoupon,
      clearCoupon,
      purchase,
    }),
    [
      cartInstance,
      bulkPurchase,
      totalItemCount,
      purchaseInfo,
      selectedCoupon,
      getById,
      addItem,
      selectCoupon,
      clearCoupon,
      purchase,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

