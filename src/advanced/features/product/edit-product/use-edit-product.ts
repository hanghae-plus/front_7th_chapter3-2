import { useState } from 'react';
import { ProductWithUI, useProducts } from '../../../entities/product';
import { useToast } from '../../../shared/ui/toast/toast-context';

interface PropsType {
  product: ProductWithUI;
  onCloseProductForm: () => void;
}

export function useEditProduct({ product, onCloseProductForm }: PropsType) {
  const { updateProduct } = useProducts();
  const { toast } = useToast();
  const [productForm, setProductForm] = useState(() => product);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductForm({
      ...productForm,
      name: e.target.value,
    });
  };

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductForm({
      ...productForm,
      description: e.target.value,
    });
  };

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setProductForm({
        ...productForm,
        price: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handleBlurPrice = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      setProductForm({ ...productForm, price: 0 });
    }

    if (parseInt(value) < 0) {
      toast({
        message: '가격은 0보다 커야 합니다',
        type: 'error',
      });
      setProductForm({ ...productForm, price: 0 });
    }
  };

  const handleChangeStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '' || /^\d+$/.test(value)) {
      setProductForm({
        ...productForm,
        stock: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handleBlurStock = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setProductForm({ ...productForm, stock: 0 });
    }

    if (parseInt(value) < 0) {
      toast({
        message: '재고는 0보다 커야 합니다',
        type: 'error',
      });

      setProductForm({ ...productForm, stock: 0 });
    }

    if (parseInt(value) > 9999) {
      toast({
        message: '재고는 9999개를 초과할 수 없습니다',
        type: 'error',
      });

      setProductForm({ ...productForm, stock: 9999 });
    }
  };

  const handleChangeDiscountQuantity =
    (discountIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDiscounts = [...productForm.discounts];
      newDiscounts[discountIndex].quantity = parseInt(e.target.value) || 0;

      setProductForm({
        ...productForm,
        discounts: newDiscounts,
      });
    };

  const handleChangeDiscountRate =
    (discountIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDiscounts = [...productForm.discounts];
      newDiscounts[discountIndex].rate = (parseInt(e.target.value) || 0) / 100;
      setProductForm({
        ...productForm,
        discounts: newDiscounts,
      });
    };

  const handleRemoveDiscount = (discountIndex: number) => () => {
    const newDiscounts = productForm.discounts.filter(
      (_, i) => i !== discountIndex
    );
    setProductForm({
      ...productForm,
      discounts: newDiscounts,
    });
  };

  const handleAddDiscount = () => {
    const newDiscounts = [
      ...productForm.discounts,
      { quantity: 10, rate: 0.1 },
    ];
    setProductForm({ ...productForm, discounts: newDiscounts });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(product.id, productForm);

    toast({
      message: '상품이 수정되었습니다.',
      type: 'success',
    });

    onCloseProductForm();
  };

  return {
    form: productForm,
    onChangeName: handleChangeName,
    onChangeDescription: handleChangeDescription,
    onChangePrice: handleChangePrice,
    onBlurPrice: handleBlurPrice,
    onChangeStock: handleChangeStock,
    onBlurStock: handleBlurStock,
    onChangeDiscountQuantity: handleChangeDiscountQuantity,
    onChangeDiscountRate: handleChangeDiscountRate,
    onRemoveDiscount: handleRemoveDiscount,
    onAddDiscount: handleAddDiscount,
    onUpdateProduct: handleUpdateProduct,
  };
}
