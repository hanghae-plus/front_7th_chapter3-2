import { CartItem } from "../../types";
import { getTotalItemCount } from "../models/cart";
import { IconCartButton } from "./common/icons/IconCartButton";
import { Button } from "./common/ui/Button";
import { InputField } from "./common/ui/InputField";

interface HeaderProps {
  isAdmin: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  cart: CartItem[];
}

export const Header = ({
  isAdmin,
  searchTerm,
  setSearchTerm,
  setIsAdmin,
  cart,
}: HeaderProps) => {
  const totalItemCount = getTotalItemCount(cart);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {!isAdmin && (
              <div className="ml-8 flex-1 max-w-md">
                <InputField
                  value={searchTerm}
                  placeholder="상품 검색..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>
          <nav className="flex items-center space-x-4">
            <Button
              onClick={() => setIsAdmin(!isAdmin)}
              size="sm"
              variant={isAdmin ? "primary" : "text"}
              children={isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
            />
            {!isAdmin && (
              <div className="relative">
                <IconCartButton />
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
