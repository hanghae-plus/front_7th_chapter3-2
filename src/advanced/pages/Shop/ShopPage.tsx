import { ProductList } from "./components/ProductList";
import { CartSection } from "./components/CartSection";

interface ShopPageProps {
  searchTerm: string;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function ShopPage({ searchTerm, addNotification }: ShopPageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          debouncedSearchTerm={searchTerm}
          addNotification={addNotification}
        />
      </div>

      <div className="lg:col-span-1">
        <CartSection addNotification={addNotification} />
      </div>
    </div>
  );
}
