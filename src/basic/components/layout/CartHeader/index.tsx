import { type FC } from "react";
import CartBadge from "./CartBadge";
import SearchBar from "./SearchBar";

interface IProps {
  searchTerm: string;
  totalCount: number;
  onChange: (prev: boolean) => void;
  setSearchTerm: (searchTerm: string) => void;
}

const CartHeader: FC<IProps> = ({
  searchTerm,
  totalCount,
  onChange,
  setSearchTerm,
}) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>

            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => onChange()}
              className="px-3 py-1.5 text-sm rounded transition-colors text-gray-600 hover:text-gray-900">
              "관리자 페이지로"
            </button>
            <CartBadge count={totalCount} />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default CartHeader;
