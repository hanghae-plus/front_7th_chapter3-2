import { useState } from "react";
import { Header } from "./shared/components/layout/Header";
import { Notification } from "./shared/components/Notification";
import { HomePage } from "./shared/components/pages/HomePage";
import { AdminPage } from "./shared/components/pages/AdminPage";
import { ProductSearch } from "./domains/product/components/ProductSearch";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification />

      <Header
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        searchSlot={!isAdmin ? <ProductSearch /> : undefined}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage activeTab={activeTab} onTabChange={setActiveTab} />
        ) : (
          <HomePage />
        )}
      </main>
    </div>
  );
}

export default App;
