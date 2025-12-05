import { Header, Logo, ToggleButton } from '../primitives';
import { AdminPage } from '../../pages/AdminPage';

interface AdminPageLayoutProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminPageLayout = ({
  isAdmin,
  setIsAdmin,
}: AdminPageLayoutProps) => {
  return (
    <>
      <Header>
        <Header.Left>
          <Logo text="SHOP" />
        </Header.Left>
        <Header.Right>
          <ToggleButton
            isActive={isAdmin}
            activeText="쇼핑몰로 돌아가기"
            inactiveText="관리자 페이지로"
            onClick={() => setIsAdmin(!isAdmin)}
          />
        </Header.Right>
      </Header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AdminPage />
      </main>
    </>
  );
};
