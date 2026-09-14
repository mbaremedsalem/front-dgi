import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Landmark, ArrowRight, Loader2, MessageSquareWarning, Search, Hash } from 'lucide-react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';

const STATUS_LABELS = {
  AUTHORIZED: 'autorisé',
  REJECTED: 'rejeté',
  PENDING: 'en attente',
};

export default function AccountsList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api
      .listAccounts()
      .then(setAccounts)
      .catch((err) => setError(err.message || 'Impossible de charger les comptes.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredAccounts = accounts.filter((acc) => {
    if (!normalizedQuery) return true;
    const statusLabel = STATUS_LABELS[acc.status] || acc.status || '';
    return (
      (acc.accountNumber || '').toLowerCase().includes(normalizedQuery) ||
      acc.transactionId.toLowerCase().includes(normalizedQuery) ||
      statusLabel.toLowerCase().includes(normalizedQuery) ||
      (acc.rejectionReasonLabel || '').toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Comptes bancaires</h1>
          <p className="page-header__subtitle">Demandes d'ajout de compte reçues du STT</p>
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
      {loading && (
        <div className="loading">
          <Loader2 size={18} className="spin" /> Chargement…
        </div>
      )}

      {!loading && !error && accounts.length === 0 && (
        <div className="empty-state">Aucun compte pour le moment.</div>
      )}

      {!loading && accounts.length > 0 && filteredAccounts.length === 0 && (
        <div className="empty-state">Aucun résultat pour « {query} ».</div>
      )}

      {!loading && filteredAccounts.length > 0 && (
        <div className="card-grid">
          {filteredAccounts.map((acc) => (
            <Link key={acc.transactionId} to={`/comptes/${acc.transactionId}`} className="tx-card">
              <span className="tx-card__top">
                <span className="tx-card__icon tx-card__icon--account">
                  <Landmark size={18} />
                </span>
                <span className="tx-card__badges">
                  <span className="tx-card__badge tx-card__badge--account">{acc.operationType}</span>
                  <StatusBadge status={acc.status} />
                </span>
              </span>
              {acc.accountNumber && (
                <span className="tx-card__account-number">
                  <Hash size={13} /> N° de compte : <strong>{acc.accountNumber}</strong>
                </span>
              )}
              <span className="tx-card__id">{acc.transactionId}</span>
              {acc.status === 'REJECTED' && acc.rejectionReasonLabel && (
                <span className="tx-card__reason">
                  <MessageSquareWarning size={13} />
                  Motif : {acc.rejectionReasonLabel}
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
