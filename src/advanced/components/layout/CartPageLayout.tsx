import {
  Header,
  Logo,
  SearchBar,
  CartBadge,
  ToggleButton,
} from '../primitives';
import { CartPage } from '../../pages/CartPage';
import { useCartContext } from '../../contexts';

interface CartPageLayoutProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debouncedSearchTerm: string;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const CartPageLayout = ({
  searchTerm,
  setSearchTerm,
  debouncedSearchTerm,
  isAdmin,
  setIsAdmin,
}: CartPageLayoutProps) => {
  const { totalItemCount } = useCartContext();

  return (
    <>
      <Header>
        <Header.Left>
          <Logo text="SHOP" />
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="상품 검색..."
          />
        </Header.Left>
        <Header.Right>
          <ToggleButton
            isActive={isAdmin}
            activeText="쇼핑몰로 돌아가기"
            inactiveText="관리자 페이지로"
            onClick={() => setIsAdmin(!isAdmin)}
          />
          <CartBadge count={totalItemCount} />
        </Header.Right>
      </Header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <CartPage searchTerm={debouncedSearchTerm} />
      </main>
    </>
  );
};
