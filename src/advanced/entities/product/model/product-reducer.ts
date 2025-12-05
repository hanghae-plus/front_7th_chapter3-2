import { ProductWithUI } from './product-interface';

export const PRODUCT_ACTIONS = {
  ADD_PRODUCT: 'product/ADD_PRODUCT',
  UPDATE_PRODUCT: 'product/UPDATE_PRODUCT',
  DELETE_PRODUCT: 'product/DELETE_PRODUCT',
  SET_PRODUCTS: 'product/SET_PRODUCTS',
} as const;

export type ProductAction =
  | {
      type: typeof PRODUCT_ACTIONS.ADD_PRODUCT;
      payload: { product: ProductWithUI };
    }
  | {
      type: typeof PRODUCT_ACTIONS.UPDATE_PRODUCT;
      payload: { productId: string; updates: Partial<ProductWithUI> };
    }
  | {
      type: typeof PRODUCT_ACTIONS.DELETE_PRODUCT;
      payload: { productId: string };
    }
  | {
      type: typeof PRODUCT_ACTIONS.SET_PRODUCTS;
      payload: { products: ProductWithUI[] };
    };

export interface ProductState {
  items: ProductWithUI[];
}

export const initialProductState: ProductState = {
  items: [],
};

/** 상품 상태 관리 Reducer (순수 함수) */
export function productReducer(
  state: ProductState,
  action: ProductAction
): ProductState {
  switch (action.type) {
    case PRODUCT_ACTIONS.ADD_PRODUCT: {
      const { product } = action.payload;
      return {
        ...state,
        items: [...state.items, product],
      };
    }

    case PRODUCT_ACTIONS.UPDATE_PRODUCT: {
      const { productId, updates } = action.payload;
      return {
        ...state,
        items: state.items.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        ),
      };
    }

    case PRODUCT_ACTIONS.DELETE_PRODUCT: {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter((p) => p.id !== productId),
      };
    }

    case PRODUCT_ACTIONS.SET_PRODUCTS: {
      const { products } = action.payload;
      return {
        ...state,
        items: products,
      };
    }

    default:
      return state;
  }
}
