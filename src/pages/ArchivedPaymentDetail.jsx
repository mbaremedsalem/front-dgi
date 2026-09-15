import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Banknote,
  Landmark,
  Building2,
  Hash,
  FileText,
  Phone,
  CalendarDays,
  BadgeCheck,
  Archive,
  Printer,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { usePrint } from '../context/PrintContext';
import StatusBadge from '../components/StatusBadge';

export default function ArchivedPaymentDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const { printPayment } = usePrint();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .getArchivedPaymentDetail(id, token)
      .then(setDetail)
      .catch((err) => setError(err.message || 'Impossible de charger le paiement traité.'))
      .finally(() => setLoading(false));
  }, [id, token]);

  return (
    <div>
      <Link to="/paiements-archives" className="back-link">
        <ArrowLeft size={15} /> Retour aux paiements traités
      </Link>

      <div className="page-header">
        <div>
          <h1>Détail du paiement traité</h1>
          <p className="page-header__subtitle">{id}</p>
        </div>
        {detail && (
          <button className="btn btn--primary" onClick={() => printPayment(detail)}>
            <Printer size={15} /> Imprimer
          </button>
        )}
      </div>

      {loading && (
        <div className="loading">
          <Loader2 size={18} className="spin" /> Chargement…
        </div>
      )}
      {error && (
        <div className="alert alert--error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {detail && (
        <div className="detail-card">
          <dl className="detail-list detail-list--icons">
            <div className="detail-list__item">
              <span className="detail-list__icon">
                <BadgeCheck size={16} />
              </span>
              <div>
                <dt>Statut</dt>
                <dd>
                  <StatusBadge status={detail.status} />
                </dd>
              </div>
            </div>
            <div className="detail-list__item">
              <span className="detail-list__icon">
                <Banknote size={16} />
              </span>
              <div>
                <dt>Montant</dt>
                <dd>{detail.amount} MRU</dd>
              </div>
            </div>
            <div className="detail-list__item">
              <span className="detail-list__icon">
                <Landmark size={16} />
              </span>
              <div>
                <dt>IBAN</dt>
                <dd>{detail.taxPayerIban}</dd>
              </div>
            </div>
            <div className="detail-list__item">
              <span className="detail-list__icon">
                <Building2 size={16} />
              </span>
              <div>
                <dt>Raison sociale</dt>
                <dd>{detail.taxPayerLegalName}</dd>
              </div>
            </div>
            <div className="detail-list__item">
              <span className="detail-list__icon">
                <Hash size={16} />
              </span>
              <div>
                <dt>NIF</dt>
                <dd>{detail.nif}</dd>
              </div>
            </div>
            <div className="detail-list__item">
              <span className="detail-list__icon">
                <FileText size={16} />
              </span>
              <div>
                <dt>NTD</dt>
                <dd>{detail.ntd}</dd>
              </div>
            </div>
            <div className="detail-list__item">
              <span className="detail-list__icon">
                <Phone size={16} />
              </span>
              <div>
                <dt>Téléphone</dt>
                <dd>{detail.taxPayerPhoneNumber}</dd>
              </div>
            </div>
            <div className="detail-list__item">
              <span className="detail-list__icon">
                <CalendarDays size={16} />
              </span>
              <div>
                <dt>Date de l'opération</dt>
                <dd>{detail.operationDate}</dd>
              </div>
            </div>
            {detail.transactionIdBank && (
              <div className="detail-list__item">
                <span className="detail-list__icon">
                  <Hash size={16} />
                </span>
                <div>
                  <dt>Référence banque</dt>
                  <dd>{detail.transactionIdBank}</dd>
                </div>
              </div>
            )}
            {detail.archivedAt && (
              <div className="detail-list__item">
                <span className="detail-list__icon">
                  <Archive size={16} />
                </span>
                <div>
                  <dt>Traité le</dt>
                  <dd>{detail.archivedAt}</dd>
                </div>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
