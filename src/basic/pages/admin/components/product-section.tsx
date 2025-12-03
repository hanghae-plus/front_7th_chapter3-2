import { useState } from 'react';
import Button from '../../../components/button';
import { XIcon } from '../../../components/icons';
import Input from '../../../components/input';
import Label from '../../../components/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/table';
import useForm from '../../../hooks/form';
import { AddNotification } from '../../../hooks/notifications';
import useToggle from '../../../hooks/toggle';
import { ProductForm, ProductWithUI } from '../../../types/products';
import { formatPrice } from '../../../utils/format';
import { initialForm } from '../constants/products';

interface ProductSectionProps {
  products: ProductWithUI[];
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  addNotification: AddNotification;
}

const ProductSection = ({ products, addProduct, updateProduct, deleteProduct, addNotification }: ProductSectionProps) => {
  const { isOpen, open, close } = useToggle(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const onSubmit = (data: ProductForm) => {
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, data);
      setEditingProduct(null);
    } else {
      addProduct(data);
    }
    setEditingProduct(null);
    close();
  };

  const { form, setForm, resetForm, handleSubmit } = useForm({ initialForm, onSubmit });

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || []
    });
    open();
  };

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>상품 목록</h2>
          <Button
            size='sm'
            variant='dark'
            onClick={() => {
              setEditingProduct('new');
              resetForm();
              open();
            }}
          >
            새 상품 추가
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>상품명</TableHead>
            <TableHead>가격</TableHead>
            <TableHead>재고</TableHead>
            <TableHead>설명</TableHead>
            <TableHead align='right'>작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => (
            <TableRow key={product.id}>
              <TableCell className='font-medium text-gray-900'>{product.name}</TableCell>
              <TableCell className='text-gray-500'>
                {formatPrice(product.price, {
                  suffix: '원',
                  isSoldOut: product.stock <= 0
                })}
              </TableCell>
              <TableCell className='text-gray-500'>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stock > 10
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.stock}개
                </span>
              </TableCell>
              <TableCell className='text-gray-500 max-w-xs truncate'>{product.description || '-'}</TableCell>
              <TableCell align='right' className='font-medium'>
                <Button variant='subtle' onClick={() => startEditProduct(product)} className='mr-3'>
                  수정
                </Button>
                <Button variant='destructive' onClick={() => deleteProduct(product.id)}>
                  삭제
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isOpen && (
        <div className='p-6 border-t border-gray-200 bg-gray-50'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>{editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}</h3>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <Label>상품명</Label>
                <Input type='text' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label>설명</Label>
                <Input type='text' value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <Label>가격</Label>
                <Input
                  type='text'
                  value={form.price === 0 ? '' : form.price}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      setForm({ ...form, price: value === '' ? 0 : parseInt(value) });
                    }
                  }}
                  onBlur={e => {
                    const value = e.target.value;
                    if (value === '') {
                      setForm({ ...form, price: 0 });
                    } else if (parseInt(value) < 0) {
                      addNotification('가격은 0보다 커야 합니다', 'error');
                      setForm({ ...form, price: 0 });
                    }
                  }}
                  placeholder='숫자만 입력'
                  required
                />
              </div>
              <div>
                <Label>재고</Label>
                <Input
                  type='text'
                  value={form.stock === 0 ? '' : form.stock}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      setForm({ ...form, stock: value === '' ? 0 : parseInt(value) });
                    }
                  }}
                  onBlur={e => {
                    const value = e.target.value;
                    if (value === '') {
                      setForm({ ...form, stock: 0 });
                    } else if (parseInt(value) < 0) {
                      addNotification('재고는 0보다 커야 합니다', 'error');
                      setForm({ ...form, stock: 0 });
                    } else if (parseInt(value) > 9999) {
                      addNotification('재고는 9999개를 초과할 수 없습니다', 'error');
                      setForm({ ...form, stock: 9999 });
                    }
                  }}
                  placeholder='숫자만 입력'
                  required
                />
              </div>
            </div>
            <div className='mt-4'>
              <Label>할인 정책</Label>
              <div className='space-y-2'>
                {form.discounts.map((discount, index) => (
                  <div key={index} className='flex items-center gap-2 bg-gray-50 p-2 rounded'>
                    <Input
                      type='number'
                      value={discount.quantity}
                      onChange={e => {
                        const newDiscounts = [...form.discounts];
                        newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                        setForm({ ...form, discounts: newDiscounts });
                      }}
                      className='w-20'
                      min='1'
                      placeholder='수량'
                    />
                    <span className='text-sm'>개 이상 구매 시</span>
                    <Input
                      type='number'
                      value={discount.rate * 100}
                      onChange={e => {
                        const newDiscounts = [...form.discounts];
                        newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
                        setForm({ ...form, discounts: newDiscounts });
                      }}
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
                        const newDiscounts = form.discounts.filter((_, i) => i !== index);
                        setForm({ ...form, discounts: newDiscounts });
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
                    setForm({
                      ...form,
                      discounts: [...form.discounts, { quantity: 10, rate: 0.1 }]
                    });
                  }}
                  className='text-sm'
                >
                  + 할인 추가
                </Button>
              </div>
            </div>

            <div className='flex justify-end gap-3'>
              <Button
                size='md'
                variant='outline'
                type='button'
                onClick={() => {
                  setEditingProduct(null);
                  resetForm();
                  close();
                }}
              >
                취소
              </Button>
              <Button size='md' variant='primary' type='submit'>
                {editingProduct === 'new' ? '추가' : '수정'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default ProductSection;
