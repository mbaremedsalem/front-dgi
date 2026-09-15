import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Archive, ArrowRight, Loader2, Search, Building2 } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function ArchivedPaymentsList() {
  const { token } = useAuth();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api
      .listArchivedPayments(token)
      .then(setPayments)
      .catch((err) => setError(err.message || 'Impossible de charger les paiements archivés.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPayments = payments.filter((p) => {
    if (!normalizedQuery) return true;
    return (
      p.transactionId.toLowerCase().includes(normalizedQuery) ||
      (p.taxPayerLegalName || '').toLowerCase().includes(normalizedQuery) ||
      (p.nif || '').toLowerCase().includes(normalizedQuery) ||
      String(p.ntd || '').toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Paiements archivés</h1>
          <p className="page-header__subtitle">Paiements déjà traités et archivés</p>
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
          placeholder="Rechercher par nom, NIF ou référence…"
        />
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {loading && (
        <div className="loading">
          <Loader2 size={18} className="spin" /> Chargement…
        </div>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="empty-state">Aucun paiement archivé pour le moment.</div>
      )}

      {!loading && payments.length > 0 && filteredPayments.length === 0 && (
        <div className="empty-state">Aucun résultat pour « {query} ».</div>
      )}

      {!loading && filteredPayments.length > 0 && (
        <div className="card-grid">
          {filteredPayments.map((p) => (
            <Link key={p.transactionId} to={`/paiements-archives/${p.transactionId}`} className="tx-card">
              <span className="tx-card__top">
                <span className="tx-card__icon tx-card__icon--payment">
                  <Archive size={18} />
                </span>
                <span className="tx-card__badges">
                  <span className="tx-card__badge tx-card__badge--payment">{p.operationType}</span>
                  <StatusBadge status={p.status} />
                </span>
              </span>
              {p.taxPayerLegalName && (
                <span className="tx-card__account-number">
                  <Building2 size={13} /> {p.taxPayerLegalName}
                </span>
              )}
              <span className="tx-card__id">{p.transactionId}</span>
              <span className="tx-card__footer">
                <span className="tx-card__cta">
                  Voir le détail <ArrowRight size={14} />
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
