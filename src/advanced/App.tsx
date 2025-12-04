import { useState } from "react";
import Header from "./components/Header";
import ShoppingMallTemplate from "./components/ShoppingMall/ShoppingMallPage";
import AdminPage from "./components/Admin/AdminPage";
import Noti from "./components/Notification";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-hx-screen bg-gray-50">
      <Noti />
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <main className="max-w-7xl mx-auto px-4 py-8">{isAdmin ? <AdminPage /> : <ShoppingMallTemplate />}</main>
    </div>
  );
};

export default App;
