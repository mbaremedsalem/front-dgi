import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrintProvider } from './context/PrintContext';
import { ConfirmProvider } from './context/ConfirmContext';
import ProtectedRoute from './components/ProtectedRoute';
import MenuGuard from './components/MenuGuard';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AccountsList from './pages/AccountsList';
import AccountDetail from './pages/AccountDetail';
import PaymentsList from './pages/PaymentsList';
import PaymentDetail from './pages/PaymentDetail';
import ArchivedPaymentsList from './pages/ArchivedPaymentsList';
import ArchivedPaymentDetail from './pages/ArchivedPaymentDetail';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <PrintProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Navigate to="/accueil" replace />} />

                  <Route element={<MenuGuard menu="accueil" />}>
                    <Route path="/accueil" element={<Dashboard />} />
                  </Route>

                  <Route element={<MenuGuard menu="comptes" />}>
                    <Route path="/comptes" element={<AccountsList />} />
                    <Route path="/comptes/:id" element={<AccountDetail />} />
                  </Route>

                  <Route element={<MenuGuard menu="paiements" />}>
                    <Route path="/paiements" element={<PaymentsList />} />
                    <Route path="/paiements/:id" element={<PaymentDetail />} />
                  </Route>

                  <Route element={<MenuGuard menu="paiements-traites" />}>
                    <Route path="/paiements-archives" element={<ArchivedPaymentsList />} />
                    <Route path="/paiements-archives/:id" element={<ArchivedPaymentDetail />} />
                  </Route>

                  <Route path="/profil" element={<Profile />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </PrintProvider>
      </ConfirmProvider>
    </AuthProvider>
  );
}
