import { CartItem } from '../../types';
import { type ViewMode } from '../hooks/useViewMode';

import SearchBar from './SesarchBar';

interface HeaderProps {
  viewMode: ViewMode;
  toggleViewMode: () => void;
  isAdminView: boolean;
  isCartView: boolean;
  cart: CartItem[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const Header = ({
  viewMode,
  toggleViewMode,
  isAdminView,
  isCartView,
  cart,
  searchTerm,
  setSearchTerm,
}: HeaderProps) => {
  const getTotalItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {viewMode === 'cart' && (
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                className="ml-8 flex-1 max-w-md"
              />
            )}
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={toggleViewMode}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isAdminView
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isAdminView ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
            </button>
            {isCartView && (
              <div className="relative">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>

                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItemCount()}
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
