// 장해야 할 데이터는 모두 Entity(Product)로 모은다. ProductWithUI 제거 이유

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
  description?: string;
  isRecommended?: boolean;
}

export interface Discount {
  quantity: number;
  rate: number;
}

export type NewProduct = Omit<Product, 'id'>;
