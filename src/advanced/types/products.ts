export interface Discount {
  quantity: number;
  rate: number;
}

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

export interface ProductFormData extends Omit<Product, 'id'> {
  description: string;
}
