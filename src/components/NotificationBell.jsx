import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Landmark, CreditCard } from 'lucide-react';

function timeAgo(ts) {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return "à l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  return `il y a ${Math.floor(hours / 24)} j`;
}

export default function NotificationBell({ notifications, unreadCount, markRead, markAllRead }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleClick = (notif) => {
    markRead(notif.id);
    setOpen(false);
    if (notif.type === 'ACCOUNT') navigate(`/comptes/${notif.transactionId}`);
    else navigate(`/paiements/${notif.transactionId}`);
  };

  return (
    <div className="notif-bell" ref={ref}>
      <button className="notif-bell__trigger" onClick={() => setOpen((v) => !v)} aria-label="Notifications">
        <Bell size={22} strokeWidth={2} />
        {unreadCount > 0 && <span className="notif-bell__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-bell__dropdown">
          <div className="notif-bell__header">
            <span>Notifications</span>
            {notifications.length > 0 && (
              <button className="notif-bell__mark-all" onClick={markAllRead}>
                <CheckCheck size={14} /> Tout marquer lu
              </button>
            )}
          </div>
          <div className="notif-bell__list">
            {notifications.length === 0 && <div className="notif-bell__empty">Aucune notification</div>}
            {notifications.map((n) => (
              <button
                key={n.id}
                className={`notif-bell__item ${n.read ? '' : 'notif-bell__item--unread'}`}
                onClick={() => handleClick(n)}
              >
                <span className={`notif-bell__icon notif-bell__icon--${n.type.toLowerCase()}`}>
                  {n.type === 'ACCOUNT' ? <Landmark size={15} /> : <CreditCard size={15} />}
                </span>
                <span className="notif-bell__text">
                  <strong>{n.type === 'ACCOUNT' ? 'Nouveau compte' : 'Nouveau paiement'}</strong>
                  <span className="notif-bell__id">{n.transactionId}</span>
                </span>
                <span className="notif-bell__time">{timeAgo(n.createdAt)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
