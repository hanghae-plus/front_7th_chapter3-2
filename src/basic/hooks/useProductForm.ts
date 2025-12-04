import { validateSetProductPrice, validationSetStock } from '@/models/product';
import { Product, ProductValidation } from '@/types';
import { isNumericString } from '@/utils/validators';
import { ChangeEvent, FocusEvent, FormEvent, useState } from 'react';

const initialProductForm: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [],
};

export const useProductForm = (
  onSubmitAction: (product: Omit<Product, 'id'>) => ProductValidation,
  close: () => void,
  initialProduct?: Product | null
) => {
  const [form, setForm] = useState<Omit<Product, 'id'> | Product>(
    initialProduct || initialProductForm
  );

  const setValue = (
    field: keyof Omit<Product, 'id'>,
    value: Omit<Product, 'id'>[typeof field]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const normalizeValue = (
    field: keyof Omit<Product, 'id'>,
    value: Omit<Product, 'id'>[typeof field]
  ) => {
    switch (field) {
      case 'price': {
        const rawValue = parseInt(value as string) || 0;
        return Math.max(rawValue, 0);
      }
      case 'stock': {
        const rawValue = parseInt(value as string) || 0;
        return Math.max(Math.min(rawValue, 9999), 0);
      }
      default:
        return value;
    }
  };

  const onBlurHandler =
    (field: keyof Omit<Product, 'id'>) => (e: FocusEvent<HTMLInputElement>) => {
      if (field === 'price') {
        const value = parseInt(e.target.value) || 0;
        const result = validateSetProductPrice(value);
        setValue(field, normalizeValue(field, value));
        return result;
      }
      if (field === 'stock') {
        const value = parseInt(e.target.value) || 0;
        const result = validationSetStock(value);
        setValue(field, normalizeValue(field, value));
        return result;
      }
    };

  const onChangeHandler =
    (field: keyof Omit<Product, 'id'>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (
        (field === 'price' || field === 'stock') &&
        !isNumericString(e.target.value)
      )
        return;
      let value = normalizeValue(field, e.target.value);
      setValue(field, value);
    };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = onSubmitAction(form);
    if (result.valid) {
      reset();
      close();
    }
    return result;
  };

  const reset = () => {
    setForm(initialProductForm);
  };

  const loadProduct = (product: Product) => {
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
  };

  return {
    form,
    onBlurHandler,
    onChangeHandler,
    onSubmit,
    reset,
    loadProduct,
    setForm,
  };
};
