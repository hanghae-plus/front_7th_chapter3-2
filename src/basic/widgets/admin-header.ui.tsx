interface PropsType {
  onToggleAdmin: () => void;
}

export function AdminHeader({ onToggleAdmin }: PropsType) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
          </div>

          <nav className="flex items-center space-x-4">
            <button
              onClick={onToggleAdmin}
              className="px-3 py-1.5 text-sm rounded transition-colors bg-gray-800 text-white"
            >
              쇼핑몰로 돌아가기
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
