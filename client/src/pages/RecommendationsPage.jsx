import { useDeferredValue, useState } from "react";
import { SectionCard } from "../components/SectionCard.jsx";
import { ScenarioBars } from "../components/charts/ScenarioBars.jsx";
import { formatConfidence, formatCurrency } from "../utils/format.js";

export function RecommendationsPage({ dashboard }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  if (!dashboard) {
    return <div className="empty-state large">No recommendations available yet.</div>;
  }

  const recommendations = dashboard.recommendations.filter((recommendation) =>
    `${recommendation.title} ${recommendation.resourceName} ${recommendation.provider}`
      .toLowerCase()
      .includes(deferredQuery.toLowerCase())
  );

  return (
    <div className="page-grid">
      <div className="content-grid two-col">
        <SectionCard title="Optimization Opportunities" kicker="FinOps engine">
          <div className="search-row">
            <input
              className="search-input"
              placeholder="Search by title, provider, or resource"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="recommendation-grid">
            {recommendations.map((item) => (
              <article className="recommendation-card" key={item.id}>
                <div className="recommendation-topline">
                  <span className={`severity severity-${item.severity}`}>
                    {item.severity}
                  </span>
                  <span>{item.provider}</span>
                </div>
                <h4>{item.title}</h4>
                <p>{item.reason}</p>
                <div className="recommendation-meta">
                  <span>{item.resourceName}</span>
                  <strong>{formatCurrency(item.monthlySavings)} / month</strong>
                </div>
                <div className="recommendation-meta">
                  <span>{item.category}</span>
                  <span>{formatConfidence(item.confidence)}</span>
                </div>
                <div className="action-note">{item.action}</div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Forecast Outlook" kicker="Next 1 month projection">
          <div className="forecast-summary">
            <strong>{formatCurrency(dashboard.forecast.nextMonth)}</strong>
            <span>{formatConfidence(dashboard.forecast.confidence)}</span>
            <p>
              The forecast uses recent monthly drift and volatility to estimate the next billing cycle.
            </p>
          </div>
          <ScenarioBars scenarios={dashboard.forecast.scenarios} />
        </SectionCard>
      </div>
    </div>
  );
}
