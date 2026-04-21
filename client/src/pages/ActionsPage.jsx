import { SectionCard } from "../components/SectionCard.jsx";
import { formatCurrency } from "../utils/format.js";

export function ActionsPage({ dashboard, onExecuteAction, loading }) {
  if (!dashboard) {
    return <div className="empty-state large">No automation data available.</div>;
  }

  return (
    <div className="page-grid">
      <div className="content-grid two-col">
        <SectionCard title="Auto-Action Queue" kicker="Safe optimization workflow">
          <div className="table-list">
            {dashboard.actions.map((action) => (
              <div className="table-row action-row" key={action.id}>
                <div>
                  <strong>{action.target}</strong>
                  <span>
                    {action.provider} - {action.name}
                  </span>
                </div>
                <div>
                  <span>{formatCurrency(action.estimatedMonthlySavings)} / month</span>
                  <button
                    className="button-primary"
                    disabled={!dashboard.roleVisibility.canExecuteActions || loading}
                    onClick={() => onExecuteAction(action.id)}
                  >
                    Execute
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!dashboard.roleVisibility.canExecuteActions ? (
            <div className="note-card">
              Switch to Admin or DevOps role to demonstrate execution flows.
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="Recent Activity" kicker="Audit trail">
          <div className="activity-feed">
            {dashboard.recentActivity.map((activity) => (
              <article className="activity-card" key={activity.id}>
                <strong>{activity.targetResource}</strong>
                <span>{activity.status}</span>
                <p>{activity.notes}</p>
                <small>
                  {activity.executedBy} - {activity.scheduledAt}
                </small>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
