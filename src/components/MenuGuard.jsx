import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canAccessMenu } from '../lib/permissions';

export default function MenuGuard({ menu }) {
  const { role, profileLoading } = useAuth();

  if (profileLoading) {
    return (
      <div className="loading">
        <Loader2 size={18} className="spin" /> Chargement…
      </div>
    );
  }

  if (!canAccessMenu(role, menu)) return <Navigate to="/accueil" replace />;
  return <Outlet />;
}
