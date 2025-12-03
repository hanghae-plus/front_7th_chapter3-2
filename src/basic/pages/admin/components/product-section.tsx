import { useState } from 'react';
import Button from '../../../components/button';
import { XIcon } from '../../../components/icons';
import Input from '../../../components/input';
import { AddNotification } from '../../../hooks/notifications';
import { ProductWithUI } from '../../../types/products';

interface ProductSectionProps {
  products: ProductWithUI[];
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  addNotification: AddNotification;
}

const ProductSection = ({ products, addProduct, updateProduct, deleteProduct, addNotification }: ProductSectionProps) => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>
  });

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product && product.stock <= 0) {
        return 'SOLD OUT';
      }
    }

    return `${price.toLocaleString()}원`;
  };
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts
      });
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };
  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || []
    });
    setShowProductForm(true);
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
              setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
              setShowProductForm(true);
            }}
          >
            새 상품 추가
          </Button>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>상품명</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>가격</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>재고</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>설명</th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>작업</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {products.map(product => (
              <tr key={product.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{product.name}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{formatPrice(product.price, product.id)}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
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
                </td>
                <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>{product.description || '-'}</td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <Button variant='subtle' onClick={() => startEditProduct(product)} className='mr-3'>
                    수정
                  </Button>
                  <Button variant='destructive' onClick={() => deleteProduct(product.id)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showProductForm && (
        <div className='p-6 border-t border-gray-200 bg-gray-50'>
          <form onSubmit={handleProductSubmit} className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>{editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}</h3>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>상품명</label>
                <Input type='text' value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>설명</label>
                <Input type='text' value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>가격</label>
                <Input
                  type='text'
                  value={productForm.price === 0 ? '' : productForm.price}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      setProductForm({ ...productForm, price: value === '' ? 0 : parseInt(value) });
                    }
                  }}
                  onBlur={e => {
                    const value = e.target.value;
                    if (value === '') {
                      setProductForm({ ...productForm, price: 0 });
                    } else if (parseInt(value) < 0) {
                      addNotification('가격은 0보다 커야 합니다', 'error');
                      setProductForm({ ...productForm, price: 0 });
                    }
                  }}
                  placeholder='숫자만 입력'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>재고</label>
                <Input
                  type='text'
                  value={productForm.stock === 0 ? '' : productForm.stock}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      setProductForm({ ...productForm, stock: value === '' ? 0 : parseInt(value) });
                    }
                  }}
                  onBlur={e => {
                    const value = e.target.value;
                    if (value === '') {
                      setProductForm({ ...productForm, stock: 0 });
                    } else if (parseInt(value) < 0) {
                      addNotification('재고는 0보다 커야 합니다', 'error');
                      setProductForm({ ...productForm, stock: 0 });
                    } else if (parseInt(value) > 9999) {
                      addNotification('재고는 9999개를 초과할 수 없습니다', 'error');
                      setProductForm({ ...productForm, stock: 9999 });
                    }
                  }}
                  placeholder='숫자만 입력'
                  required
                />
              </div>
            </div>
            <div className='mt-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>할인 정책</label>
              <div className='space-y-2'>
                {productForm.discounts.map((discount, index) => (
                  <div key={index} className='flex items-center gap-2 bg-gray-50 p-2 rounded'>
                    <Input
                      type='number'
                      value={discount.quantity}
                      onChange={e => {
                        const newDiscounts = [...productForm.discounts];
                        newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                        setProductForm({ ...productForm, discounts: newDiscounts });
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
                        const newDiscounts = [...productForm.discounts];
                        newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
                        setProductForm({ ...productForm, discounts: newDiscounts });
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
                        const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
                        setProductForm({ ...productForm, discounts: newDiscounts });
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
                    setProductForm({
                      ...productForm,
                      discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }]
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
                  setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
                  setShowProductForm(false);
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
