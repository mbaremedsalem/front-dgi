import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import AccountsList from './pages/AccountsList';
import AccountDetail from './pages/AccountDetail';
import PaymentsList from './pages/PaymentsList';
import PaymentDetail from './pages/PaymentDetail';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/comptes" replace />} />
              <Route path="/comptes" element={<AccountsList />} />
              <Route path="/comptes/:id" element={<AccountDetail />} />
              <Route path="/paiements" element={<PaymentsList />} />
              <Route path="/paiements/:id" element={<PaymentDetail />} />
              <Route path="/profil" element={<Profile />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
