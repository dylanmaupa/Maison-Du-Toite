import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/animations/PageTransition';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Store pages
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OurStoryPage from './pages/OurStoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DeliveryReturnsPage from './pages/DeliveryReturnsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminDelivery from './pages/admin/AdminDelivery';
import AdminSettings from './pages/admin/AdminSettings';

import './index.css';

// ── Admin Route Guard ───────────────────────────────────────────────────────
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="spinner" />;
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
}

// ── Store Layout (Navbar wraps store pages only) ──────────────────────────
function StoreLayout({ children }) {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          {children}
        </PageTransition>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                borderRadius: '8px',
              },
            }}
          />
          <Routes>
            {/* ── Store Routes ── */}
            <Route path="/" element={<StoreLayout><LandingPage /></StoreLayout>} />
            <Route path="/shop" element={<StoreLayout><ShopPage /></StoreLayout>} />
            <Route path="/shop/:category" element={<StoreLayout><ShopPage /></StoreLayout>} />
            <Route path="/products/:slug" element={<StoreLayout><ProductDetailPage /></StoreLayout>} />
            <Route path="/product/:id" element={<StoreLayout><ProductDetailPage /></StoreLayout>} />
            <Route path="/cart" element={<StoreLayout><CartPage /></StoreLayout>} />
            <Route path="/checkout" element={<StoreLayout><CheckoutPage /></StoreLayout>} />
            <Route path="/order-confirmation" element={<StoreLayout><OrderConfirmationPage /></StoreLayout>} />
            <Route path="/our-story" element={<StoreLayout><OurStoryPage /></StoreLayout>} />
            <Route path="/about" element={<StoreLayout><AboutPage /></StoreLayout>} />
            <Route path="/contact" element={<StoreLayout><ContactPage /></StoreLayout>} />
            <Route path="/delivery-returns" element={<StoreLayout><DeliveryReturnsPage /></StoreLayout>} />
            <Route path="/terms" element={<StoreLayout><TermsPage /></StoreLayout>} />
            <Route path="/privacy" element={<StoreLayout><PrivacyPage /></StoreLayout>} />

            {/* ── Admin Routes ── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
            <Route path="/admin/products/:id" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/delivery" element={<AdminRoute><AdminDelivery /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
