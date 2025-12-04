import { useState } from "react";
import { Header } from "./components/common/Header";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <CartPage searchTerm={searchTerm} />}
      </main>
    </div>
  );
};

export default App;
