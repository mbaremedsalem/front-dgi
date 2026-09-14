import { NavLink, Outlet } from 'react-router-dom';
import { Landmark, CreditCard, UserCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import NotificationBell from './NotificationBell';

const NAV_ITEMS = [
  { to: '/comptes', label: 'Comptes', icon: Landmark },
  { to: '/paiements', label: 'Paiement', icon: CreditCard },
  { to: '/profil', label: 'Profil', icon: UserCircle2 },
];

export default function Layout() {
  const { username, logout } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(true);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__brand-mark">DGI</span>
          <span className="sidebar__brand-sub">Télépaiement STT</span>
        </div>
        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            >
              <Icon size={20} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="sidebar__logout" onClick={logout}>
          <LogOut size={18} strokeWidth={2} />
          <span>Déconnexion</span>
        </button>
      </aside>

      <div className="app-shell__main">
        <header className="topbar">
          <div className="topbar__spacer" />
          <NotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
            markRead={markRead}
            markAllRead={markAllRead}
          />
          <div className="topbar__user">
            <span className="topbar__avatar">{username?.slice(0, 2).toUpperCase()}</span>
            <span className="topbar__username">{username}</span>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
