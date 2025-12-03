import { useState, useEffect } from 'react';
import { CartItem, Coupon, Product } from '../../../../types';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

// 초기 데이터
const initialProducts: ProductWithUI[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 }
    ],
    description: '최고급 품질의 프리미엄 상품입니다.'
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.15 }
    ],
    description: '다양한 기능을 갖춘 실용적인 상품입니다.',
    isRecommended: true
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 }
    ],
    description: '대용량과 고성능을 자랑하는 상품입니다.'
  }
];

const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10
  }
];

const Header = ({cart, isAdmin, onAdminToggle, searchTerm, onSearchChange}: any) => {
  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    interface CartItemWithQuantity extends CartItem {
      quantity: number;
    }
    const count = (cart as CartItemWithQuantity[]).reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);


  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
    <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
        <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
            {!isAdmin && (
            <div className="ml-8 flex-1 max-w-md">
                <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="상품 검색..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>
            )}
        </div>
        <nav className="flex items-center space-x-4">
            <button
            onClick={() => onAdminToggle(!isAdmin)}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isAdmin 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            >
            {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
            </button>
            {!isAdmin && (
            <div className="relative">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItemCount}
                </span>
                )}
            </div>
            )}
        </nav>
        </div>
    </div>
    </header>
  );
};

export default Header;

function setDebouncedSearchTerm(searchTerm: any) {
  throw new Error('Function not implemented.');
}
