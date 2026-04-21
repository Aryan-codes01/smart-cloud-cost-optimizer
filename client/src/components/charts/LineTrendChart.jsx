import { formatCurrency } from "../../utils/format.js";

export function LineTrendChart({ data = [] }) {
  if (data.length === 0) {
    return <div className="empty-state">No trend data available yet.</div>;
  }

  const width = 360;
  const height = 180;
  const padding = 22;
  const maxValue = Math.max(...data.map((item) => item.cost), 1);

  const points = data
    .map((item, index) => {
      const x =
        padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
      const y =
        height - padding - ((item.cost || 0) / maxValue) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="chart-block">
      <svg viewBox={`0 0 ${width} ${height}`} className="trend-chart">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(72, 218, 174, 0.35)" />
            <stop offset="100%" stopColor="rgba(72, 218, 174, 0.02)" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="rgba(72, 218, 174, 1)"
          strokeWidth="4"
          points={points}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon
          fill="url(#trendFill)"
          points={`${points} ${width - padding},${height - padding} ${padding},${height - padding}`}
        />
        {data.map((item, index) => {
          const x =
            padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
          const y =
            height - padding - ((item.cost || 0) / maxValue) * (height - padding * 2);
          return <circle key={item.month} cx={x} cy={y} r="5" fill="#ffc857" />;
        })}
      </svg>

      <div className="chart-legend">
        {data.map((item) => (
          <div key={item.month} className="legend-row">
            <span>{item.label}</span>
            <strong>{formatCurrency(item.cost)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
