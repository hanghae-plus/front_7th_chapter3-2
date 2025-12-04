import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { toast } from "../../utils/toast";
import type { Product } from "../../../types";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

// 초기 데이터
const initialProducts: ProductWithUI[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: "최고급 품질의 프리미엄 상품입니다.",
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: "다양한 기능을 갖춘 실용적인 상품입니다.",
    isRecommended: true,
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: "대용량과 고성능을 자랑하는 상품입니다.",
  },
];

// 로컬스토리지 연동
export const productAtom = atomWithStorage<ProductWithUI[]>("products", initialProducts);

export const updateProductAtom = atom(
  null,
  (get, set, { productId, updates }: { productId: string; updates: Partial<ProductWithUI> }) => {
    const products = get(productAtom);
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, ...updates } : product
    );
    set(productAtom, updatedProducts);
    toast.success("상품이 수정되었습니다.");
  }
);

export const addProductAtom = atom(null, (get, set, newProduct: Omit<ProductWithUI, "id">) => {
  const products = get(productAtom);
  const newProductWithId = { ...newProduct, id: `p${Date.now()}` };
  set(productAtom, [...products, newProductWithId]);
  toast.success("상품이 추가되었습니다.");
});

export const deleteProductAtom = atom(null, (get, set, productId: string) => {
  const products = get(productAtom);
  const updatedProducts = products.filter((product) => product.id !== productId);
  set(productAtom, updatedProducts);
  toast.success("상품이 삭제되었습니다.");
});

// updateProductStock;
// addProductDiscount;
// removeProductDiscount;
