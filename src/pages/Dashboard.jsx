import { useEffect, useState } from 'react';
import { Landmark, CreditCard, Archive, Banknote, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { canAccessMenu } from '../lib/permissions';
import StatTile from '../components/charts/StatTile';
import DonutChart from '../components/charts/DonutChart';
import BarChart from '../components/charts/BarChart';

const PAYMENT_STATUS_LABELS = {
  AUTHORIZED: 'Autorisé',
  EXECUTED: 'Exécuté',
  REJECTED: 'Rejeté',
  PENDING: 'En attente',
  IN_PROGRESS: 'En cours',
};

const ACCOUNT_STATUS_LABELS = {
  AUTHORIZED: 'Autorisé',
  REJECTED: 'Rejeté',
  PENDING: 'En attente',
};

const STATUS_COLOR = {
  AUTHORIZED: '#1f9d55',
  EXECUTED: '#1f9d55',
  PENDING: '#d9a521',
  IN_PROGRESS: '#d9a521',
  REJECTED: '#d64545',
};

function countByStatus(items, labels) {
  const counts = {};
  items.forEach((item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
  });
  return Object.keys(labels).map((key) => ({
    key,
    label: labels[key],
    value: counts[key] || 0,
    color: STATUS_COLOR[key] || '#8a8a8a',
  }));
}

function dayKey(value) {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dayLabel(key) {
  const [, month, day] = key.split('-');
  return `${day}/${month}`;
}

function buildDailySeries(archivedPayments, days = 14) {
  const byDay = new Map();
  archivedPayments.forEach((p) => {
    if (!p.archivedAt) return;
    const key = dayKey(p.archivedAt);
    const entry = byDay.get(key) || { count: 0, amount: 0 };
    entry.count += 1;
    entry.amount += Number(p.amount) || 0;
    byDay.set(key, entry);
  });

  const lastKeys = Array.from(byDay.keys())
    .sort()
    .slice(-days);

  return lastKeys.map((key) => ({
    key,
    label: dayLabel(key),
    count: byDay.get(key).count,
    amount: byDay.get(key).amount,
  }));
}

function formatAmount(value) {
  return Number(value).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function Dashboard() {
  const { token, role } = useAuth();
  const showAccounts = canAccessMenu(role, 'comptes');

  const [accounts, setAccounts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [archived, setArchived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    Promise.allSettled([
      showAccounts ? api.listAccounts() : Promise.resolve([]),
      api.listPayments(token),
      api.listArchivedPayments(token),
    ]).then(([accRes, payRes, archRes]) => {
      setAccounts(accRes.status === 'fulfilled' ? accRes.value : []);
      setPayments(payRes.status === 'fulfilled' ? payRes.value : []);
      setArchived(archRes.status === 'fulfilled' ? archRes.value : []);

      const failed = [accRes, payRes, archRes].some((r) => r.status === 'rejected');
      setError(failed ? "Certaines données n'ont pas pu être chargées." : '');
      setLoading(false);
    });
  };

  useEffect(load, [token, showAccounts]);

  const paymentsByStatus = countByStatus(payments, PAYMENT_STATUS_LABELS);
  const accountsByStatus = countByStatus(accounts, ACCOUNT_STATUS_LABELS);
  const dailySeries = buildDailySeries(archived);
  const totalArchivedAmount = archived.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const pendingCount = payments.filter((p) => p.status === 'EXECUTED').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p className="page-header__subtitle">Vue d'ensemble de l'activité STT</p>
        </div>
        <button className="btn btn--ghost" onClick={load}>
          <RefreshCw size={15} /> Actualiser
        </button>
      </div>

      {error && (
        <div className="alert alert--error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <Loader2 size={18} className="spin" /> Chargement…
        </div>
      ) : (
        <>
          <div className="stat-grid">
            {showAccounts && (
              <StatTile label="Comptes" value={accounts.length} icon={Landmark} accent="primary" />
            )}
            <StatTile label="Paiements à traiter" value={pendingCount} icon={CreditCard} accent="gold" />
            <StatTile label="Paiements traités" value={archived.length} icon={Archive} accent="primary" />
            <StatTile
              label="Montant total traité (MRU)"
              value={formatAmount(totalArchivedAmount)}
              icon={Banknote}
              accent="success"
            />
          </div>

          <div className="chart-grid">
            <div className="chart-panel">
              <h3 className="chart-panel__title">Paiements actifs par statut</h3>
              <DonutChart data={paymentsByStatus} centerLabel="paiements" />
            </div>

            {showAccounts && (
              <div className="chart-panel">
                <h3 className="chart-panel__title">Comptes par statut</h3>
                <DonutChart data={accountsByStatus} centerLabel="comptes" />
              </div>
            )}

            <div className="chart-panel">
              <h3 className="chart-panel__title">Paiements traités par jour</h3>
              <BarChart
                data={dailySeries.map((d) => ({ key: d.key, label: d.label, value: d.count }))}
                color="var(--primary)"
                emptyMessage="Aucun paiement traité"
              />
            </div>

            <div className="chart-panel">
              <h3 className="chart-panel__title">Montant traité par jour (MRU)</h3>
              <BarChart
                data={dailySeries.map((d) => ({ key: d.key, label: d.label, value: d.amount }))}
                color="var(--accent-gold)"
                valueFormatter={formatAmount}
                emptyMessage="Aucun paiement traité"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
