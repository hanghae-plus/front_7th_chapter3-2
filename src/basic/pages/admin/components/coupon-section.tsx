import { useState } from 'react';
import Button from '../../../components/button';
import { PlusIcon, TrashIcon } from '../../../components/icons';
import Input from '../../../components/input';
import { AddNotification } from '../../../hooks/notifications';
import { Coupon } from '../../../types/coupons';

interface CouponSectionProps {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  addNotification: AddNotification;
}

const CouponSection = ({ coupons, addCoupon, deleteCoupon, addNotification }: CouponSectionProps) => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0
  });

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0
    });
    setShowCouponForm(false);
  };

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {coupons.map(coupon => (
            <div key={coupon.code} className='relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200'>
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <h3 className='font-semibold text-gray-900'>{coupon.name}</h3>
                  <p className='text-sm text-gray-600 mt-1 font-mono'>{coupon.code}</p>
                  <div className='mt-2'>
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700'>
                      {coupon.discountType === 'amount' ? `${coupon.discountValue.toLocaleString()}원 할인` : `${coupon.discountValue}% 할인`}
                    </span>
                  </div>
                </div>
                <Button variant='delete' onClick={() => deleteCoupon(coupon.code)}>
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))}
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors'>
            <button onClick={() => setShowCouponForm(!showCouponForm)} className='text-gray-400 hover:text-gray-600 flex flex-col items-center'>
              <PlusIcon />
              <p className='mt-2 text-sm font-medium'>새 쿠폰 추가</p>
            </button>
          </div>
        </div>
        {showCouponForm && (
          <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
            <form onSubmit={handleCouponSubmit} className='space-y-4'>
              <h3 className='text-md font-medium text-gray-900'>새 쿠폰 생성</h3>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>쿠폰명</label>
                  <Input
                    type='text'
                    value={couponForm.name}
                    onChange={e => setCouponForm({ ...couponForm, name: e.target.value })}
                    className='text-sm'
                    placeholder='신규 가입 쿠폰'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>쿠폰 코드</label>
                  <Input
                    type='text'
                    value={couponForm.code}
                    onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    className='text-sm font-mono'
                    placeholder='WELCOME2024'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>할인 타입</label>
                  <select
                    value={couponForm.discountType}
                    onChange={e =>
                      setCouponForm({
                        ...couponForm,
                        discountType: e.target.value as 'amount' | 'percentage'
                      })
                    }
                    className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
                  >
                    <option value='amount'>정액 할인</option>
                    <option value='percentage'>정률 할인</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    {couponForm.discountType === 'amount' ? '할인 금액' : '할인율(%)'}
                  </label>
                  <Input
                    type='text'
                    value={couponForm.discountValue === 0 ? '' : couponForm.discountValue}
                    onChange={e => {
                      const value = e.target.value;
                      if (value === '' || /^\d+$/.test(value)) {
                        setCouponForm({ ...couponForm, discountValue: value === '' ? 0 : parseInt(value) });
                      }
                    }}
                    onBlur={e => {
                      const value = parseInt(e.target.value) || 0;
                      if (couponForm.discountType === 'percentage') {
                        if (value > 100) {
                          addNotification('할인율은 100%를 초과할 수 없습니다', 'error');
                          setCouponForm({ ...couponForm, discountValue: 100 });
                        } else if (value < 0) {
                          setCouponForm({ ...couponForm, discountValue: 0 });
                        }
                      } else {
                        if (value > 100000) {
                          addNotification('할인 금액은 100,000원을 초과할 수 없습니다', 'error');
                          setCouponForm({ ...couponForm, discountValue: 100000 });
                        } else if (value < 0) {
                          setCouponForm({ ...couponForm, discountValue: 0 });
                        }
                      }
                    }}
                    className='text-sm'
                    placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
                    required
                  />
                </div>
              </div>
              <div className='flex justify-end gap-3'>
                <Button size='md' variant='outline' type='button' onClick={() => setShowCouponForm(false)}>
                  취소
                </Button>
                <Button size='md' variant='primary' type='submit'>
                  쿠폰 생성
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default CouponSection;
