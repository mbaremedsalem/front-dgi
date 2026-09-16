import { useEffect, useState } from 'react';
import { IdCard, ShieldCheck, TimerReset, LogOut, UserCircle2, Mail, BadgeCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from '../components/ChangePasswordModal';

function formatDuration(ms) {
  if (ms <= 0) return 'expiré';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} min ${seconds.toString().padStart(2, '0')} s`;
}

export default function Profile() {
  const { username, firstName, lastName, email, roleDisplay, expiresAt, logout } = useAuth();
  const [now, setNow] = useState(Date.now());
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fullName = firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : username;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Profil</h1>
          <p className="page-header__subtitle">Informations de session</p>
        </div>
      </div>

      <div className="detail-card profile-card">
        <div className="profile-card__avatar">{fullName?.slice(0, 2).toUpperCase()}</div>
        <dl className="detail-list detail-list--icons">
          {(firstName || lastName) && (
            <div className="detail-list__item">
              <span className="detail-list__icon">
                <UserCircle2 size={16} />
              </span>
              <div>
                <dt>Nom complet</dt>
                <dd>{fullName}</dd>
              </div>
            </div>
          )}
          <div className="detail-list__item">
            <span className="detail-list__icon">
              <IdCard size={16} />
            </span>
            <div>
              <dt>Identifiant</dt>
              <dd>{username}</dd>
            </div>
          </div>
          {email && (
            <div className="detail-list__item">
              <span className="detail-list__icon">
                <Mail size={16} />
              </span>
              <div>
                <dt>Email</dt>
                <dd>{email}</dd>
              </div>
            </div>
          )}
          {roleDisplay && (
            <div className="detail-list__item">
              <span className="detail-list__icon">
                <BadgeCheck size={16} />
              </span>
              <div>
                <dt>Rôle</dt>
                <dd>{roleDisplay}</dd>
              </div>
            </div>
          )}
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
        <div className="profile-card__actions">
          <button className="btn btn--ghost" onClick={() => setShowChangePassword(true)}>
            <KeyRound size={16} /> Changer le mot de passe
          </button>
          <button className="btn btn--danger" onClick={logout}>
            <LogOut size={16} /> Se déconnecter
          </button>
        </div>
      </div>

      <ChangePasswordModal open={showChangePassword} onClose={() => setShowChangePassword(false)} />
    </div>
  );
}
