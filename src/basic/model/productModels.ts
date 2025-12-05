import { Product } from "../../types";

export interface ProductWithUI extends Product {
  isRecommended?: boolean;
}
