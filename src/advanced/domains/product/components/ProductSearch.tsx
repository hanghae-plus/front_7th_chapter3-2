import { Input } from "../../../shared/components/ui/Input";
import { useStore } from "../../../shared/stores/store";

export function ProductSearch() {
  const searchTerm = useStore((state) => state.searchTerm);
  const setSearchTerm = useStore((state) => state.setSearchTerm);

  return (
    <Input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="상품 검색..."
      className="w-full"
    />
  );
}
