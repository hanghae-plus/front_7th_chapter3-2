import { Product } from "../model/types";

export function addProduct(
  products: Product[],
  newProductData: Omit<Product, "id">
): { newProducts: Product[] } {
  const newProduct: Product = {
    ...newProductData,
    id: `p${Date.now()}`,
  };
  const newProducts = [...products, newProduct];
  return { newProducts };
}

export function updateProduct(
  products: Product[],
  productId: string,
  updates: Partial<Product>
): { newProducts: Product[] } {
  const newProducts = products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );
  return { newProducts };
}

export function deleteProduct(
  products: Product[],
  productId: string
): { newProducts: Product[] } {
  const newProducts = products.filter((p) => p.id !== productId);
  return { newProducts };
}
