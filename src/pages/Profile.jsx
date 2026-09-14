import { useEffect, useState } from 'react';
import { IdCard, ShieldCheck, TimerReset, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function formatDuration(ms) {
  if (ms <= 0) return 'expiré';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} min ${seconds.toString().padStart(2, '0')} s`;
}

export default function Profile() {
  const { username, expiresAt, logout } = useAuth();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Profil</h1>
          <p className="page-header__subtitle">Informations de session</p>
        </div>
      </div>

      <div className="detail-card profile-card">
        <div className="profile-card__avatar">{username?.slice(0, 2).toUpperCase()}</div>
        <dl className="detail-list detail-list--icons">
          <div className="detail-list__item">
            <span className="detail-list__icon">
              <IdCard size={16} />
            </span>
            <div>
              <dt>Identifiant</dt>
              <dd>{username}</dd>
            </div>
          </div>
          <div className="detail-list__item">
            <span className="detail-list__icon">
              <ShieldCheck size={16} />
            </span>
            <div>
              <dt>Session STT</dt>
              <dd>Connecté</dd>
            </div>
          </div>
          <div className="detail-list__item">
            <span className="detail-list__icon">
              <TimerReset size={16} />
            </span>
            <div>
              <dt>Token STT valide encore</dt>
              <dd>{formatDuration((expiresAt || 0) - now)}</dd>
            </div>
          </div>
        </dl>
        <button className="btn btn--danger" onClick={logout}>
          <LogOut size={16} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}
