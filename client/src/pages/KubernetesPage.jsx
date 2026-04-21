import { SectionCard } from "../components/SectionCard.jsx";
import { formatCurrency } from "../utils/format.js";

export function KubernetesPage({ dashboard }) {
  if (!dashboard) {
    return <div className="empty-state large">Kubernetes insights are not available.</div>;
  }

  return (
    <div className="page-grid">
      <SectionCard title="Kubernetes Cost Monitoring" kicker="Namespace + cluster efficiency">
        <div className="k8s-grid">
          {dashboard.kubernetes.map((cluster) => (
            <article className="k8s-card" key={`${cluster.cluster}-${cluster.namespace}`}>
              <span className="eyebrow">{cluster.provider}</span>
              <h4>{cluster.cluster}</h4>
              <p>Namespace: {cluster.namespace}</p>
              <strong>{formatCurrency(cluster.cost)}</strong>
              <div className="k8s-stats">
                <span>CPU {cluster.cpuAvgPct}%</span>
                <span>Memory {cluster.memoryAvgPct}%</span>
                <span>Efficiency {cluster.efficiencyScore}</span>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
