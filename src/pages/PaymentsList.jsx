import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  CreditCard,
  ArrowRight,
  Loader2,
  MessageSquareWarning,
  Search,
  Hash,
  PlayCircle,
  AlertCircle,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { usePrint } from '../context/PrintContext';
import { useConfirm } from '../context/ConfirmContext';
import { canProcessPayment } from '../lib/permissions';
import StatusBadge from '../components/StatusBadge';

const STATUS_LABELS = {
  AUTHORIZED: 'autorisé',
  EXECUTED: 'exécuté',
  REJECTED: 'rejeté',
  PENDING: 'en attente',
  IN_PROGRESS: 'en cours',
};

export default function PaymentsList() {
  const { token, role } = useAuth();
  const { printPayment } = usePrint();
  const confirmAction = useConfirm();
  const canProcess = canProcessPayment(role);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api
      .listPayments(token)
      .then(setPayments)
      .catch((err) => setError(err.message || 'Impossible de charger les paiements.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const handleProcess = async (event, payment) => {
    event.preventDefault();
    event.stopPropagation();

    const confirmed = await confirmAction({
      title: 'Traiter ce paiement ?',
      message:
        'Cette action est irréversible. Merci de vous assurer que le dossier est déjà payé avant de continuer.',
      confirmLabel: 'Oui, traiter',
      cancelLabel: 'Annuler',
      danger: true,
    });
    if (!confirmed) return;

    setActionError('');
    setProcessingId(payment.transactionId);

    api
      .processPayment(payment.transactionId, token)
      .then((res) => {
        setPayments((prev) => prev.filter((p) => p.transactionId !== payment.transactionId));
        printPayment(res.payment || payment, res.message);
      })
      .catch((err) => setActionError(err.message || 'Impossible de traiter ce paiement.'))
      .finally(() => setProcessingId(null));
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPayments = payments.filter((p) => {
    if (!normalizedQuery) return true;
    const statusLabel = STATUS_LABELS[p.status] || p.status || '';
    return (
      (p.accountNumber || '').toLowerCase().includes(normalizedQuery) ||
      p.transactionId.toLowerCase().includes(normalizedQuery) ||
      statusLabel.toLowerCase().includes(normalizedQuery) ||
      (p.rejectionReasonLabel || '').toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Ordres de paiement</h1>
          <p className="page-header__subtitle">Ordres de paiement reçus du STT</p>
        </div>
        <button className="btn btn--ghost" onClick={load}>
          <RefreshCw size={15} /> Actualiser
        </button>
      </div>

      <div className="input-icon search-bar">
        <Search size={17} className="input-icon__icon" />
        <input
          className="input input--icon"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par numéro de compte ou statut…"
        />
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {actionError && (
        <div className="alert alert--error">
          <AlertCircle size={16} />
          <span>{actionError}</span>
        </div>
      )}
      {loading && (
        <div className="loading">
          <Loader2 size={18} className="spin" /> Chargement…
        </div>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="empty-state">Aucun paiement pour le moment.</div>
      )}

      {!loading && payments.length > 0 && filteredPayments.length === 0 && (
        <div className="empty-state">Aucun résultat pour « {query} ».</div>
      )}

      {!loading && filteredPayments.length > 0 && (
        <div className="card-grid">
          {filteredPayments.map((p) => (
            <div key={p.transactionId} className="tx-card">
              <span className="tx-card__top">
                <span className="tx-card__icon tx-card__icon--payment">
                  <CreditCard size={18} />
                </span>
                <span className="tx-card__badges">
                  <span className="tx-card__badge tx-card__badge--payment">{p.operationType}</span>
                  <StatusBadge status={p.status} />
                </span>
              </span>
              {p.accountNumber && (
                <span className="tx-card__account-number">
                  <Hash size={13} /> N° de compte : <strong>{p.accountNumber}</strong>
                </span>
              )}
              <span className="tx-card__id">{p.transactionId}</span>
              {p.status === 'REJECTED' && p.rejectionReasonLabel && (
                <span className="tx-card__reason">
                  <MessageSquareWarning size={13} />
                  Motif : {p.rejectionReasonLabel}
                </span>
              )}
              <span className="tx-card__footer">
                {canProcess && p.status === 'EXECUTED' && (
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    disabled={processingId === p.transactionId}
                    onClick={(e) => handleProcess(e, p)}
                  >
                    {processingId === p.transactionId ? (
                      <>
                        <Loader2 size={14} className="spin" /> Traitement…
                      </>
                    ) : (
                      <>
                        <PlayCircle size={14} /> Traiter
                      </>
                    )}
                  </button>
                )}
                <Link to={`/paiements/${p.transactionId}`} className="tx-card__cta">
                  Voir le détail <ArrowRight size={14} />
                </Link>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
