export default function BarChart({ data, color = 'var(--primary)', valueFormatter = (v) => v, emptyMessage }) {
  if (data.length === 0) {
    return <div className="bar-chart bar-chart--empty">{emptyMessage || 'Aucune donnée'}</div>;
  }

  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="bar-chart">
      <div className="bar-chart__bars">
        {data.map((d) => {
          const heightPct = d.value > 0 ? Math.max((d.value / max) * 100, 4) : 0;
          return (
            <div key={d.key} className="bar-chart__col">
              <div className="bar-chart__track">
                <div
                  className="bar-chart__bar"
                  style={{ height: `${heightPct}%`, background: color }}
                  title={`${d.label} : ${valueFormatter(d.value)}`}
                />
              </div>
              <span className="bar-chart__tick">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
