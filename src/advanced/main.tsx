import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { CouponProvider } from "./hooks/useCoupons";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CouponProvider>
    <App />
  </CouponProvider>
);
