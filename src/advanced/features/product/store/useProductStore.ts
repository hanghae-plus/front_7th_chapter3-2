import { useAtomValue, useSetAtom } from 'jotai';
import {
  productsAtom,
  addProductAtom,
  updateProductAtom,
  deleteProductAtom,
  updateProductStockAtom,
  addProductDiscountAtom,
  removeProductDiscountAtom,
} from '@/features/product/store/product.atom';
import { Discount, Product, ProductValidation } from '@/features/product';
import { useCallback } from 'react';

export function useProductStore() {
  const products = useAtomValue(productsAtom);

  const setAddProduct = useSetAtom(addProductAtom);
  const setUpdateProduct = useSetAtom(updateProductAtom);
  const setDeleteProduct = useSetAtom(deleteProductAtom);
  const setUpdateProductStock = useSetAtom(updateProductStockAtom);
  const setAddProductDiscount = useSetAtom(addProductDiscountAtom);
  const setRemoveProductDiscount = useSetAtom(removeProductDiscountAtom);

  const addProduct = useCallback(
    (
      newProduct: Omit<Product, 'id'>,
      options?: {
        onSuccess?: (validation: ProductValidation) => void;
        onError?: (validation: ProductValidation) => void;
      }
    ) => {
      setAddProduct({ newProduct, options });
    },
    [setAddProduct]
  );

  const updateProduct = useCallback(
    (
      product: Partial<Product>,
      options?: {
        onSuccess?: (validation: ProductValidation) => void;
        onError?: (validation: ProductValidation) => void;
      }
    ) => {
      setUpdateProduct({ product, options });
    },
    [setUpdateProduct]
  );

  const deleteProduct = useCallback(
    (
      productId: string,
      options?: {
        onSuccess?: (validation: ProductValidation) => void;
        onError?: (validation: ProductValidation) => void;
      }
    ) => {
      setDeleteProduct({ productId, options });
    },
    [setDeleteProduct]
  );

  const updateProductStock = useCallback(
    (productId: string, stock: number) => {
      setUpdateProductStock({ productId, stock });
    },
    [setUpdateProductStock]
  );

  const addProductDiscount = useCallback(
    (productId: string, discount: Discount) => {
      setAddProductDiscount({ productId, discount });
    },
    [setAddProductDiscount]
  );

  const removeProductDiscount = useCallback(
    (productId: string, discount: Discount) => {
      setRemoveProductDiscount({ productId, discount });
    },
    [setRemoveProductDiscount]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
  };
}
