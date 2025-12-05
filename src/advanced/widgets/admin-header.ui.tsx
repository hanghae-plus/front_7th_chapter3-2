import { useAdmin } from '../shared/hooks/use-admin';
import { Button } from '../shared/ui/button';

export function AdminHeader() {
  const { toggleAdmin } = useAdmin();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
          </div>

          <nav className="flex items-center space-x-4">
            <Button variant="dark" size="sm" onClick={toggleAdmin}>
              쇼핑몰로 돌아가기
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
