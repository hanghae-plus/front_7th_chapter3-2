import { ProductWithUI } from "../../../App";
import { formatKRW, FormatKRWOptions } from "../../../shared/utils/formatKRW";

type FormatProductPriceOptions = {
  products: ProductWithUI[];
  formatOptions?: FormatKRWOptions;
};

export function formatProductPrice(
  price: number,
  productId: string,
  options: FormatProductPriceOptions
) {
  const { products, formatOptions } = options;
  const product = products.find((p) => p.id === productId);
  if (product && product.stock <= 0) {
    return "SOLD OUT";
  }
  return formatKRW(price, formatOptions ?? { type: "suffix", suffix: "원" });
}
