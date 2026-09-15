const SIZE = 168;
const THICKNESS = 24;
const RADIUS = (SIZE - THICKNESS) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP_PX = 3;

export default function DonutChart({ data, centerLabel }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const visibleSlices = data.filter((d) => d.value > 0);

  let cumulative = 0;
  const segments = visibleSlices.map((d) => {
    const fraction = total > 0 ? d.value / total : 0;
    const raw = fraction * CIRCUMFERENCE;
    const visible = visibleSlices.length > 1 ? Math.max(raw - GAP_PX, 0) : raw;
    const offset = -cumulative;
    cumulative += raw;
    return { ...d, fraction, visible, offset };
  });

  return (
    <div className="donut-chart">
      <div className="donut-chart__ring">
        {total === 0 ? (
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--border)"
              strokeWidth={THICKNESS}
            />
          </svg>
        ) : (
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
              {segments.map((seg) => (
                <circle
                  key={seg.key}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={THICKNESS}
                  strokeDasharray={`${seg.visible} ${CIRCUMFERENCE - seg.visible}`}
                  strokeDashoffset={seg.offset}
                  strokeLinecap="butt"
                >
                  <title>
                    {seg.label} : {seg.value} ({Math.round(seg.fraction * 100)}%)
                  </title>
                </circle>
              ))}
            </g>
          </svg>
        )}
        <div className="donut-chart__center">
          <span className="donut-chart__center-value">{total}</span>
          {centerLabel && <span className="donut-chart__center-label">{centerLabel}</span>}
        </div>
      </div>

      <ul className="donut-chart__legend">
        {data.map((d) => (
          <li key={d.key} className="donut-chart__legend-item">
            <span className="donut-chart__legend-dot" style={{ background: d.color }} />
            <span className="donut-chart__legend-label">{d.label}</span>
            <span className="donut-chart__legend-value">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
