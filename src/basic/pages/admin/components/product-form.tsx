import { ChangeEvent, FocusEvent, useEffect, useCallback } from 'react';
import Button from '../../../components/button';
import { XIcon } from '../../../components/icons';
import Input from '../../../components/input';
import Label from '../../../components/label';
import useForm from '../../../hooks/form';
import { AddNotification } from '../../../hooks/notifications';
import { ProductFormData, ProductWithUI } from '../../../types/products';
import { validateRange } from '../../../utils/validator';
import { removeDiscount, addDefaultDiscount } from '../../../utils/discount';
import { getProductFormTitle, getProductFormSubmitText, isEditingProduct } from '../../../utils/product-form';
import { isNumericInput, parseNumericInput, convertPercentageToDecimal, convertDecimalToPercentage } from '../../../utils/form';
import { initialForm, PRODUCT_VALIDATION_RULES } from '../constants/products';

interface ProductFormProps {
  products: ProductWithUI[];
  editingProduct: string | null;
  setEditingProduct: (productId: string | null) => void;
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  close: () => void;
  addNotification: AddNotification;
}

const ProductForm = ({ products, editingProduct, setEditingProduct, addProduct, updateProduct, close, addNotification }: ProductFormProps) => {
  const onSubmit = useCallback(
    (data: ProductFormData) => {
      if (isEditingProduct(editingProduct)) {
        updateProduct(editingProduct!, data);
      } else {
        addProduct(data);
      }
      setEditingProduct(null);
      close();
    },
    [editingProduct, addProduct, updateProduct, setEditingProduct, close]
  );

  const { form, setForm, resetForm, handleSubmit } = useForm({ initialForm, onSubmit });

  const handleChange = {
    name: (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value }),
    description: (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, description: e.target.value }),
    price: (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (isNumericInput(value)) {
        setForm({ ...form, price: parseNumericInput(value) });
      }
    },
    stock: (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (isNumericInput(value)) {
        setForm({ ...form, stock: parseNumericInput(value) });
      }
    },
    discountQuantity: (e: ChangeEvent<HTMLInputElement>, index: number) => {
      const newDiscounts = [...form.discounts];
      newDiscounts[index].quantity = parseNumericInput(e.target.value) || 0;
      setForm({ ...form, discounts: newDiscounts });
    },
    discountRate: (e: ChangeEvent<HTMLInputElement>, index: number) => {
      const newDiscounts = [...form.discounts];
      newDiscounts[index].rate = convertPercentageToDecimal(parseNumericInput(e.target.value) || 0);
      setForm({ ...form, discounts: newDiscounts });
    }
  };

  const handleBlur = {
    price: (e: FocusEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value) || 0;
      const validation = validateRange(value, PRODUCT_VALIDATION_RULES.price);

      if (!validation.isValid) {
        addNotification(validation.errorMessage!, 'error');
        setForm({ ...form, price: validation.validatedValue });
      }
    },
    stock: (e: FocusEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value) || 0;
      const validation = validateRange(value, PRODUCT_VALIDATION_RULES.stock);

      if (!validation.isValid) {
        addNotification(validation.errorMessage!, 'error');
        setForm({ ...form, stock: validation.validatedValue });
      }
    }
  };

  useEffect(() => {
    if (!editingProduct) return;
    if (editingProduct === 'new') {
      resetForm();
      return;
    }

    const product = products.find(product => product.id === editingProduct);
    if (!product) return;

    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || []
    });
  }, [editingProduct]);

  const handleCancel = useCallback(() => {
    setEditingProduct(null);
    resetForm();
    close();
  }, [setEditingProduct, resetForm, close]);

  return (
    <div className='p-6 border-t border-gray-200 bg-gray-50'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900'>{getProductFormTitle(editingProduct)}</h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <Label>상품명</Label>
            <Input type='text' value={form.name} onChange={handleChange.name} required />
          </div>
          <div>
            <Label>설명</Label>
            <Input type='text' value={form.description} onChange={handleChange.description} />
          </div>
          <div>
            <Label>가격</Label>
            <Input
              type='text'
              value={form.price === 0 ? '' : form.price}
              onChange={handleChange.price}
              onBlur={handleBlur.price}
              placeholder='숫자만 입력'
              required
            />
          </div>
          <div>
            <Label>재고</Label>
            <Input
              type='text'
              value={form.stock === 0 ? '' : form.stock}
              onChange={handleChange.stock}
              onBlur={handleBlur.stock}
              placeholder='숫자만 입력'
              required
            />
          </div>
        </div>
        <div className='mt-4'>
          <Label className='mb-2'>할인 정책</Label>
          <div className='space-y-2'>
            {form.discounts.map((discount, index) => (
              <div key={index} className='flex items-center gap-2 bg-gray-50 p-2 rounded'>
                <Input
                  type='number'
                  value={discount.quantity}
                  onChange={e => handleChange.discountQuantity(e, index)}
                  className='w-20'
                  min='1'
                  placeholder='수량'
                />
                <span className='text-sm'>개 이상 구매 시</span>
                <Input
                  type='number'
                  value={convertDecimalToPercentage(discount.rate)}
                  onChange={e => handleChange.discountRate(e, index)}
                  className='w-16'
                  min='0'
                  max='100'
                  placeholder='%'
                />
                <span className='text-sm'>% 할인</span>
                <Button
                  variant='destructive'
                  type='button'
                  onClick={() => {
                    setForm({ ...form, discounts: removeDiscount(form.discounts, index) });
                  }}
                >
                  <XIcon />
                </Button>
              </div>
            ))}
            <Button
              variant='subtle'
              type='button'
              onClick={() => {
                setForm({ ...form, discounts: addDefaultDiscount(form.discounts) });
              }}
              className='text-sm'
            >
              + 할인 추가
            </Button>
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button size='md' variant='outline' type='button' onClick={handleCancel}>
            취소
          </Button>
          <Button size='md' variant='primary' type='submit'>
            {getProductFormSubmitText(editingProduct)}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
