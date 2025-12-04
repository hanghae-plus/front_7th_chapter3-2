import { useCallback, useState } from "react";
import { ProductForm, ProductAccordion } from "../product";
import type { ProductWithUI } from "../../hooks/useProducts";
import { addProductAtom, updateProductAtom } from "../../stores/atoms/productAtoms";
import { useSetAtom } from "jotai";

export const ManagementProduct = () => {
  const [show, setShow] = useState(false);

  const [productForm, setProductForm] = useState<Omit<ProductWithUI, "id">>(productFormInit);

  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const resetProductForm = useCallback(() => {
    setProductForm(productFormInit);
    setEditingProduct(null);
    setShow(false);
  }, [setProductForm, setEditingProduct, setShow]);

  const updateProduct = useSetAtom(updateProductAtom);
  const addProduct = useSetAtom(addProductAtom);

  const handleProductSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (editingProduct && editingProduct !== "new") {
        updateProduct({ productId: editingProduct, updates: productForm });
        setEditingProduct(null);
      } else {
        addProduct({
          ...productForm,
          discounts: productForm.discounts,
        });
      }
      resetProductForm();
    },
    [editingProduct, productForm, addProduct, updateProduct, resetProductForm]
  );

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>상품 목록</h2>
          <button
            onClick={() => {
              setEditingProduct("new");
              setProductForm(productFormInit);
              setShow(true);
            }}
            className='px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800'
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductAccordion
        setEditingProduct={setEditingProduct}
        setProductForm={setProductForm}
        setShow={setShow}
      />
      {show && (
        <ProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          handleProductSubmit={handleProductSubmit}
          resetProductForm={resetProductForm}
        />
      )}
    </section>
  );
};

const productFormInit: Omit<ProductWithUI, "id"> = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};
