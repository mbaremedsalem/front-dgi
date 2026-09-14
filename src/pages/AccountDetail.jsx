import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Landmark,
  Building2,
  Hash,
  Phone,
  CalendarDays,
  Eye,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AccountDetail() {
  const { id } = useParams();
  const { token } = useAuth();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .getAccountDetail(id, token)
      .then(setDetail)
      .catch((err) => setError(err.message || 'Impossible de charger le compte.'))
      .finally(() => setLoading(false));
  }, [id, token]);

  return (
    <div>
      <Link to="/comptes" className="back-link">
        <ArrowLeft size={15} /> Retour à la liste des comptes
      </Link>

      <div className="page-header">
        <div>
          <h1>Détail du compte</h1>
          <p className="page-header__subtitle">{id}</p>
        </div>
        <span className="view-only-badge">
          <Eye size={14} /> Consultation seule
        </span>
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
          </dl>
        </div>
      )}
    </div>
  );
}
