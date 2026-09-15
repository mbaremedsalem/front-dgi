export default function StatTile({ label, value, icon: Icon, accent = 'primary' }) {
  return (
    <div className="stat-tile">
      <span className={`stat-tile__icon stat-tile__icon--${accent}`}>
        <Icon size={20} />
      </span>
      <div>
        <span className="stat-tile__value">{value}</span>
        <span className="stat-tile__label">{label}</span>
      </div>
    </div>
  );
}
