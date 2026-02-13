import './App.css'
import './themes.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import {
  HomePage,
  AboutPage,
  ProductsPage,
  DeliveryPage,
  ContactsPage,
  LoginPage,
  CabinetPage,
  CooperationPage,
  AdminPage,
  AdminLoginPage,
  ProductCatalogPage,
  ShoppingCartPage,
  OrderHistoryPage,
  Footer,
  DeveloperPage
} from './pages';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PageTransition from './components/PageTransition';

function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <AuthProvider>
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/cooperation" element={<CooperationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cabinet" element={<CabinetPage />} />
            <Route path="/developer-panel" element={<DeveloperPage />} />
            <Route path="/catalog" element={<ProductCatalogPage />} />
            <Route path="/cart" element={<ShoppingCartPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            {/* Secret admin routes */}
            <Route path="/cp-admin-2024" element={<AdminLoginPage />} />
            <Route path="/cp-admin-panel" element={<AdminPage />} />
          </Routes>
        </PageTransition>
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App


