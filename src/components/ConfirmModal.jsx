import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-card__close" onClick={onCancel} aria-label="Fermer">
          <X size={16} />
        </button>

        <span className={`modal-card__icon ${danger ? 'modal-card__icon--danger' : ''}`}>
          <AlertTriangle size={24} />
        </span>

        <h2 id="confirm-modal-title" className="modal-card__title">
          {title}
        </h2>
        <p className="modal-card__message">{message}</p>

        <div className="modal-card__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            {cancelLabel || 'Annuler'}
          </button>
          <button type="button" className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`} onClick={onConfirm}>
            {confirmLabel || 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  );
}
