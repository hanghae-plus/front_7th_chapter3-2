import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NotificationProvider } from "./contexts/NotificationContext.tsx";
import { CartProvider } from "./contexts/CartContext.tsx";
import { CouponProvider } from "./contexts/CouponContext.tsx";
import { ProductProvider } from "./contexts/ProductContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NotificationProvider>
      <CouponProvider>
        <CartProvider>
          <ProductProvider>
            <App />
          </ProductProvider>
        </CartProvider>
      </CouponProvider>
    </NotificationProvider>
  </React.StrictMode>
);
