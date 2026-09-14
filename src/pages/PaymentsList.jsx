import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, CreditCard, ArrowRight, Loader2, MessageSquareWarning, Search } from 'lucide-react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';

const STATUS_LABELS = {
  AUTHORIZED: 'autorisé',
  EXECUTED: 'exécuté',
  REJECTED: 'rejeté',
  PENDING: 'en attente',
  IN_PROGRESS: 'en cours',
};

export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api
      .listPayments()
      .then(setPayments)
      .catch((err) => setError(err.message || 'Impossible de charger les paiements.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPayments = payments.filter((p) => {
    if (!normalizedQuery) return true;
    const statusLabel = STATUS_LABELS[p.status] || p.status || '';
    return (
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
          placeholder="Rechercher par identifiant ou statut…"
        />
      </div>

      {error && <div className="alert alert--error">{error}</div>}
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
            <Link key={p.transactionId} to={`/paiements/${p.transactionId}`} className="tx-card">
              <span className="tx-card__top">
                <span className="tx-card__icon tx-card__icon--payment">
                  <CreditCard size={18} />
                </span>
                <span className="tx-card__badges">
                  <span className="tx-card__badge tx-card__badge--payment">{p.operationType}</span>
                  <StatusBadge status={p.status} />
                </span>
              </span>
              <span className="tx-card__id">{p.transactionId}</span>
              {p.status === 'REJECTED' && p.rejectionReasonLabel && (
                <span className="tx-card__reason">
                  <MessageSquareWarning size={13} />
                  Motif : {p.rejectionReasonLabel}
                </span>
              )}
              <span className="tx-card__cta">
                Voir le détail <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
