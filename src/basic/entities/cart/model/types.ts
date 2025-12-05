import { ProductWithUI } from "../../product/model/types";

export interface CartItem {
  product: ProductWithUI;
  quantity: number;
}
