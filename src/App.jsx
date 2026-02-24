import { BrowserRouter, Routes, Route, ScrollRestoration } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OurStoryPage from './pages/OurStoryPage';
import './index.css';

function ScrollToTop() {
  // Simple scroll-to-top on route change using a layout effect would need
  // React hooks, so we handle it inline with window.scrollTo via useEffect in each page.
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
