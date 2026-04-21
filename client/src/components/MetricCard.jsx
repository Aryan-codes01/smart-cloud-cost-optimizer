import { formatCurrency } from "../utils/format.js";

export function MetricCard({ metric }) {
  const isCurrency = metric.unit === "USD";
  const trendPrefix = metric.trend > 0 ? "+" : "";

  return (
    <article className={`metric-card tone-${metric.tone}`}>
      <span className="metric-label">{metric.label}</span>
      <strong className="metric-value">
        {isCurrency ? formatCurrency(metric.value) : metric.value}
      </strong>
      <span className="metric-trend">
        {trendPrefix}
        {metric.trend}
        {metric.unit === "actions" ? " logged" : "%"}
      </span>
    </article>
  );
}
