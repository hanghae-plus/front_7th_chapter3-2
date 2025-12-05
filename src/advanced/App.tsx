import { useState } from "react";
import AdminPage from "./components/AdminPage";

import { useSearch } from "./hooks/useSearch";
import { Notifications } from "./components/Notifications";
import { Header } from "./components/header";
import { SearchBar } from "./components/header/SearchBar";
import { ToggleButton } from "./components/header/ToggleButton";
import { CartIcon } from "./components/header/CartIcon";
import CartPage from "./components/CartPage";

const App = () => {
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useSearch(500);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications />
      <Header
        leftSide={
          !isAdmin && (
            <div className="ml-8 flex-1 max-w-md">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
          )
        }
        rightSide={
          <nav className="flex items-center space-x-4">
            <ToggleButton isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
            {!isAdmin && <CartIcon />}
          </nav>
        }
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage />
        ) : (
          <CartPage debouncedSearchTerm={debouncedSearchTerm} />
        )}
      </main>
    </div>
  );
};

export default App;
