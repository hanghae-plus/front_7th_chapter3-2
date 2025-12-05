export function ProductSearchBar({
  searchTerm,
  onChange,
}: {
  searchTerm: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="ml-8 flex-1 max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onChange(e.target.value)}
        placeholder="상품 검색..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
