// product
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: {
    quantity: number;
    rate: number;
  }[];
}

// cart
export interface CartItem {
  product: Product;
  quantity: number;
}

// coupon
export interface Coupon {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

export interface Discount {
  quantity: number;
  rate: number;
}

// notification
export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}
