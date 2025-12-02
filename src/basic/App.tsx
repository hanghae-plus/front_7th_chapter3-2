// TODO: 메인 App 컴포넌트
// 힌트:
// 1. isAdmin 상태를 관리하여 쇼핑몰/관리자 모드 전환
// 2. 네비게이션 바에 모드 전환 버튼 포함
// 3. 조건부 렌더링으로 CartPage 또는 AdminPage 표시
// 4. 상태 관리는 각 페이지 컴포넌트에서 처리 (App은 라우팅만 담당)

import { useState } from "react";
import { Header } from "./components/layout/Header";
import { CartItem, Notification } from "../types";
import Notifications from "./components/Notifications";

export function App() {
  // TODO: 구현
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItemCount, setTotalItemCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        hasCartItems={cart.length > 0}
        totalItemCount={totalItemCount}
      />
    </div>
  );
}

export default App;
