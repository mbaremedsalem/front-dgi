import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Banknote,
  Landmark,
  Building2,
  Hash,
  FileText,
  Phone,
  CalendarDays,
  PlayCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { usePrint } from '../context/PrintContext';
import { useConfirm } from '../context/ConfirmContext';
import { canProcessPayment } from '../lib/permissions';

export default function PaymentDetail() {
  const { id } = useParams();
  const { token, role } = useAuth();
  const { printPayment } = usePrint();
  const confirmAction = useConfirm();
  const navigate = useNavigate();
  const canProcess = canProcessPayment(role);

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .getPaymentDetail(id, token)
      .then(setDetail)
      .catch((err) => setError(err.message || 'Impossible de charger le paiement.'))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleProcess = async () => {
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
    setProcessing(true);

    api
      .processPayment(id, token)
      .then((res) => {
        printPayment(res.payment || detail, res.message);
        navigate('/paiements-archives/' + id);
      })
      .catch((err) => setActionError(err.message || 'Impossible de traiter ce paiement.'))
      .finally(() => setProcessing(false));
  };

  return (
    <div>
      <Link to="/paiements" className="back-link">
        <ArrowLeft size={15} /> Retour à la liste des paiements
      </Link>

      <div className="page-header">
        <div>
          <h1>Détail du paiement</h1>
          <p className="page-header__subtitle">{id}</p>
        </div>
        {detail && canProcess && (
          <button className="btn btn--primary" onClick={handleProcess} disabled={processing}>
            {processing ? (
              <>
                <Loader2 size={15} className="spin" /> Traitement…
              </>
            ) : (
              <>
                <PlayCircle size={15} /> Traiter
              </>
            )}
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
      {actionError && (
        <div className="alert alert--error">
          <AlertCircle size={16} />
          <span>{actionError}</span>
        </div>
      )}

      {detail && (
        <div className="detail-card">
          <dl className="detail-list detail-list--icons">
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
          </dl>
        </div>
      )}
    </div>
  );
}
