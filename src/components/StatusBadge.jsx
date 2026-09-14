import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const STATUS_MAP = {
  AUTHORIZED: { label: 'Autorisé', icon: CheckCircle2, className: 'status-badge--authorized' },
  EXECUTED: { label: 'Exécuté', icon: CheckCircle2, className: 'status-badge--authorized' },
  REJECTED: { label: 'Rejeté', icon: XCircle, className: 'status-badge--rejected' },
  PENDING: { label: 'En attente', icon: Clock, className: 'status-badge--pending' },
  IN_PROGRESS: { label: 'En cours', icon: Clock, className: 'status-badge--pending' },
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  const { label, icon: Icon, className } = STATUS_MAP[status] || {
    label: status,
    icon: Clock,
    className: 'status-badge--pending',
  };

  return (
    <span className={`status-badge ${className}`}>
      <Icon size={12} /> {label}
    </span>
  );
}
