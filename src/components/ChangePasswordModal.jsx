import { useEffect, useState } from 'react';
import { KeyRound, X, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ChangePasswordModal({ open, onClose }) {
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswords(false);
    setError('');
    setSuccess('');
    setLoading(false);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const data = await changePassword(oldPassword, newPassword);
      setSuccess(data?.message || 'Mot de passe modifié avec succès.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Impossible de modifier le mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-card__close" onClick={onClose} aria-label="Fermer">
          <X size={16} />
        </button>

        <span className="modal-card__icon">
          <KeyRound size={24} />
        </span>

        <h2 id="change-password-title" className="modal-card__title">
          Changer le mot de passe
        </h2>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="field">
            <span>Mot de passe actuel</span>
            <div className="input-icon">
              <KeyRound size={18} className="input-icon__icon" />
              <input
                className="input input--icon input--icon-right"
                type={showPasswords ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          <label className="field">
            <span>Nouveau mot de passe</span>
            <div className="input-icon">
              <KeyRound size={18} className="input-icon__icon" />
              <input
                className="input input--icon input--icon-right"
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </label>

          <label className="field">
            <span>Confirmer le nouveau mot de passe</span>
            <div className="input-icon">
              <KeyRound size={18} className="input-icon__icon" />
              <input
                className="input input--icon input--icon-right"
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="input-icon__toggle"
                onClick={() => setShowPasswords((v) => !v)}
                aria-label={showPasswords ? 'Masquer les mots de passe' : 'Afficher les mots de passe'}
                tabIndex={-1}
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && (
            <div className="alert alert--error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert--success">
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          <div className="modal-card__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Fermer
            </button>
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" /> Modification…
                </>
              ) : (
                'Valider'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
