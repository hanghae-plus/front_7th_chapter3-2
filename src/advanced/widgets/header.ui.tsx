import { useAdmin } from '../shared/hooks/use-admin';
import { ShoppingCartIcon } from '../shared/ui/icons';
import { Button } from '../shared/ui/button';

interface PropsType {
  searchTerm: string;
  totalItemCount: number;
  onChangeSearchTerm: (value: string) => void;
}

export function Header({
  searchTerm,
  totalItemCount,
  onChangeSearchTerm,
}: PropsType) {
  const { toggleAdmin } = useAdmin();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>

            <div className="ml-8 flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onChangeSearchTerm(e.target.value)}
                placeholder="상품 검색..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAdmin}
              className="text-gray-600 hover:text-gray-900"
            >
              관리자 페이지로
            </Button>

            <div className="relative">
              <ShoppingCartIcon
                size="lg"
                variant="detailed"
                className="text-gray-700"
              />
              {totalItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
