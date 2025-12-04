import { useState } from "react";
import { TIMING } from "../../constants";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { SearchBar } from "./SearchBar";
import { ProductList } from "./ProductList";
import Cart from "./Cart";

interface CartPageProps {
  completeOrder: () => void;
}

export const CartPage = ({ completeOrder }: CartPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(
    searchTerm,
    TIMING.SEARCH_DEBOUNCE_MS
  );

  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ProductList debouncedSearchTerm={debouncedSearchTerm} />
        </div>

        <div className="lg:col-span-1">
          <Cart completeOrder={completeOrder} />
        </div>
      </div>
    </>
  );
};
