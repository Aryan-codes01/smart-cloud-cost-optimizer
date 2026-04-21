import { MetricCard } from "../components/MetricCard.jsx";
import { SectionCard } from "../components/SectionCard.jsx";
import { DonutChart } from "../components/charts/DonutChart.jsx";
import { LineTrendChart } from "../components/charts/LineTrendChart.jsx";
import { UploadPanel } from "../components/sections/UploadPanel.jsx";
import { formatCurrency } from "../utils/format.js";

export function DashboardPage({
  dashboard,
  loading,
  onUpload,
  onSyncProvider,
}) {
  if (!dashboard && loading) {
    return <div className="empty-state large">Loading platform insights...</div>;
  }

  if (!dashboard) {
    return <div className="empty-state large">Dashboard data is unavailable.</div>;
  }

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">College Submission + SaaS Vision</span>
          <h2>Show upload-based optimization today, then pitch live multi-cloud automation tomorrow.</h2>
          <p>
            This dashboard is built to demo monthly cost trends, service breakdowns,
            actionable savings, forecast intelligence, and safe auto-actions from one interface.
          </p>
        </div>
        <div className="hero-callouts">
          <div>
            <strong>{dashboard.recommendations.length}</strong>
            <span>Active recommendations</span>
          </div>
          <div>
            <strong>{dashboard.actions.length}</strong>
            <span>Automation playbooks</span>
          </div>
        </div>
      </section>

      <div className="metric-grid">
        {dashboard.heroMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="content-grid two-col">
        <SectionCard title="Monthly Spend Trend" kicker="Forecast-ready">
          <LineTrendChart data={dashboard.monthlyTrend} />
        </SectionCard>

        <SectionCard title="Current Service Split" kicker="Latest billing month">
          <DonutChart data={dashboard.serviceBreakdown.slice(0, 6)} />
        </SectionCard>
      </div>

      <div className="content-grid two-col">
        <SectionCard title="Billing Data Ingestion" kicker="CSV / JSON upload">
          <UploadPanel onUpload={onUpload} loading={loading} />
        </SectionCard>

        <SectionCard title="Provider Connectors" kicker="Live billing sync">
          <div className="provider-grid">
            {dashboard.providerStatuses.map((provider) => (
              <article className="provider-card" key={provider.provider}>
                <div>
                  <strong>{provider.provider}</strong>
                  <span>{provider.capability}</span>
                </div>
                <p>{provider.mode}</p>
                <small>
                  Last sync: {provider.lastSync ? new Date(provider.lastSync).toLocaleString() : "Not yet"}
                </small>
                <button
                  className="button-secondary"
                  onClick={() => onSyncProvider(provider.provider)}
                >
                  Sync {provider.provider}
                </button>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="content-grid two-col">
        <SectionCard title="High-Cost Resources" kicker="Rightsizing view">
          <div className="table-list">
            {dashboard.topResources.map((resource) => (
              <div className="table-row" key={resource.resourceName}>
                <div>
                  <strong>{resource.resourceName}</strong>
                  <span>
                    {resource.provider} - {resource.service}
                  </span>
                </div>
                <div>
                  <strong>{formatCurrency(resource.cost)}</strong>
                  <span>{resource.utilizationPct}% utilization</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Platform Readiness" kicker="Why this feels product-grade">
          <div className="readiness-stack">
            {dashboard.platformReadiness.map((item) => (
              <article key={item.label} className="readiness-card">
                <div>
                  <strong>{item.label}</strong>
                  <span className="status-tag">{item.status}</span>
                </div>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
