import { Product } from "../../types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}
