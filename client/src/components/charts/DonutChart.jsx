import { formatCurrency } from "../../utils/format.js";

const palette = ["#48daae", "#ffc857", "#ff7f51", "#7ec8e3", "#9be564", "#f36f8c"];

export function DonutChart({ data = [] }) {
  if (data.length === 0) {
    return <div className="empty-state">No breakdown data available.</div>;
  }

  const total = data.reduce((sum, item) => sum + item.cost, 0);
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="donut-layout">
      <svg viewBox="0 0 140 140" className="donut-chart">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="18"
        />
        {data.map((item, index) => {
          const portion = item.cost / total;
          const dash = portion * circumference;
          const segment = (
            <circle
              key={item.name}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={palette[index % palette.length]}
              strokeWidth="18"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
              strokeLinecap="round"
            />
          );
          offset += dash;
          return segment;
        })}
        <text x="70" y="64" textAnchor="middle" className="donut-total-label">
          Total
        </text>
        <text x="70" y="84" textAnchor="middle" className="donut-total-value">
          {Math.round(total)}
        </text>
      </svg>

      <div className="legend-stack">
        {data.map((item, index) => (
          <div className="legend-row" key={item.name}>
            <span className="legend-name">
              <i style={{ backgroundColor: palette[index % palette.length] }} />
              {item.name}
            </span>
            <strong>{formatCurrency(item.cost)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
