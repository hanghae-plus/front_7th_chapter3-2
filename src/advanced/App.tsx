import { useAtomValue } from "jotai";
import { isAdminAtom } from "./stores/atoms/uiAtoms";
import { Header, AdminPage, CartPage } from "./components/layout";
import { ToastContainer } from "./components/toast";
import { SearchBar } from "./components/search";

const App = () => {
  const isAdmin = useAtomValue(isAdminAtom);

  return (
    <div className='min-h-screen bg-gray-50'>
      <ToastContainer />
      <Header>
        <SearchBar />
      </Header>
      <main className='max-w-7xl mx-auto px-4 py-8'>{isAdmin ? <AdminPage /> : <CartPage />}</main>
    </div>
  );
};

export default App;
