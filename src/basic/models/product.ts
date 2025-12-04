import { ProductWithUI } from "../../types";

const addProduct = (products: ProductWithUI[], newProduct: Omit<ProductWithUI, "id">) => {
  const product: ProductWithUI = { ...newProduct, id: `p${Date.now()}` };
  return [...products, product];
};

const updateProduct = (products: ProductWithUI[], productId: string, updates: Partial<ProductWithUI>) => {
  return products.map((product) => (product.id === productId ? { ...product, ...updates } : product));
};

const deleteProduct = (products: ProductWithUI[], productId: string) => {
  return products.filter((p) => p.id !== productId);
};

const updateProductStock = (products: ProductWithUI[], productId: string, newStock: number) => {
  return products.map((product) => (product.id === productId ? { ...product, stock: newStock } : product));
};

const addProductDiscount = (
  products: ProductWithUI[],
  productId: string,
  discount: { quantity: number; rate: number }
) => {
  return products.map((product) =>
    product.id === productId ? { ...product, discounts: [...product.discounts, discount] } : product
  );
};

const removeProductDiscount = (
  products: ProductWithUI[],
  productId: string,
  discount: { quantity: number; rate: number }
) => {
  return products.map((product) =>
    product.id === productId
      ? {
          ...product,
          discounts: product.discounts.filter((d) => d.quantity !== discount.quantity && d.rate !== discount.rate),
        }
      : product
  );
};

export default {
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  addProductDiscount,
  removeProductDiscount,
};
