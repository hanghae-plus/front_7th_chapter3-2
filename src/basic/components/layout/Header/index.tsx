import { type FC } from "react";
import CartBadge from "./CartBadge";
import SearchBar from "./SearchBar";
import { CartItem } from "../../../../types";
import { useCart } from "../../../hooks/useCart";

interface IProps {
  isAdmin: boolean;
  searchTerm: string;
  setIsAdmin: (isAdmin: boolean) => void;
  setSearchTerm: (searchTerm: string) => void;
}

const Header: FC<IProps> = ({
  isAdmin,
  searchTerm,
  setIsAdmin,
  setSearchTerm,
}) => {
  
  const { cart } = useCart();

  const getAdminButtonClass = (isAdmin: boolean) => {
    const base = "px-3 py-1.5 text-sm rounded transition-colors";
    const variant = isAdmin
      ? "bg-gray-800 text-white"
      : "text-gray-600 hover:text-gray-900";
    return `${base} ${variant}`;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {!isAdmin && (
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={getAdminButtonClass(isAdmin)}>
              {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
            </button>
            {!isAdmin && <CartBadge cart={cart} />}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
