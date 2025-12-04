import { Provider } from "jotai";
import { Notifications } from "./components/common/ui/Notifications";
import { Header } from "./components/Header";
import { PageAdmin } from "./pages/PageAdmin";
import { PageShopping } from "./pages/PageShopping";
import { useAtoms } from "./hooks/useAtoms";

const AppContent = () => {
  const { isAdmin } = useAtoms();

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications />
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <PageAdmin /> : <PageShopping />}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
};

export default App;
