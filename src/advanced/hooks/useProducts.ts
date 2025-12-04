import { atom, useAtom } from "jotai";
import { ProductWithUI } from "../../types";
import { initialProducts } from "../constants/data";
import { atomWithStorage } from "jotai/utils";

const atomProducts = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);
const atomProductForm = atom<ProductWithUI>({
  id: "",
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
  isRecommended: false,
});
const atomEditingProduct = atom<string | null>(null);

export const useProducts = () => {
  const [products, setProducts] = useAtom(atomProducts);
  const [productForm, setProductForm] = useAtom(atomProductForm);
  const [editingProduct, setEditingProduct] = useAtom(atomEditingProduct);

  return {
    products,
    setProducts,
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
  };
};
