import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ProductProvider } from './entities/product';
import { CouponProvider } from './entities/coupon';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProductProvider>
      <CouponProvider>
        <App />
      </CouponProvider>
    </ProductProvider>
  </React.StrictMode>
);
