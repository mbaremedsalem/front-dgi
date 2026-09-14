import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Landmark, Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    const dest = location.state?.from?.pathname || '/comptes';
    return <Navigate to={dest} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/comptes', { replace: true });
    } catch (err) {
      setError(err.message || 'Identifiants invalides.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-aside">
          <div className="login-aside__mark">
            <Landmark size={26} strokeWidth={2} />
            <span>DGI</span>
          </div>
          <h2 className="login-aside__title">Espace banque</h2>
          <p className="login-aside__text">
            Portail sécurisé de télépaiement pour la gestion des comptes et ordres de paiement
            transmis par le STT.
          </p>
          <ul className="login-aside__features">
            <li>
              <ShieldCheck size={18} />
              Connexion chiffrée et session limitée dans le temps
            </li>
            <li>
              <Landmark size={18} />
              Suivi en temps réel des comptes et paiements
            </li>
          </ul>
        </div>

        <div className="login-card">
          <div className="login-card__brand login-card__brand--mobile">
            <Landmark size={22} />
            <span>DGI — Télépaiement STT</span>
          </div>

          <h1 className="login-card__title">Connexion</h1>
          <p className="login-card__subtitle">Accédez à votre espace banque</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label className="field">
              <span>Identifiant</span>
              <div className="input-icon">
                <User size={18} className="input-icon__icon" />
                <input
                  className="input input--icon"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: 10016"
                  autoComplete="username"
                  required
                />
              </div>
            </label>

            <label className="field">
              <span>Mot de passe</span>
              <div className="input-icon">
                <Lock size={18} className="input-icon__icon" />
                <input
                  className="input input--icon input--icon-right"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="input-icon__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="alert alert--error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" /> Connexion…
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
