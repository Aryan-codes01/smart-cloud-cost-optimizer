export function TopBar({
  role,
  cloud,
  onRoleChange,
  onCloudChange,
  onRefresh,
  providerStatuses = [],
}) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">Unified FinOps Control Plane</span>
        <h2>Optimization dashboard for AWS, Azure, and GCP</h2>
      </div>

      <div className="topbar-actions">
        <label className="field-group">
          <span>Role</span>
          <select value={role} onChange={(event) => onRoleChange(event.target.value)}>
            <option value="admin">Admin</option>
            <option value="devops">DevOps</option>
            <option value="finance">Finance</option>
          </select>
        </label>

        <label className="field-group">
          <span>Cloud</span>
          <select value={cloud} onChange={(event) => onCloudChange(event.target.value)}>
            <option value="all">All Clouds</option>
            <option value="aws">AWS</option>
            <option value="azure">Azure</option>
            <option value="gcp">GCP</option>
          </select>
        </label>

        <button className="button-secondary" onClick={onRefresh}>
          Refresh Data
        </button>
      </div>

      <div className="provider-ribbon">
        {providerStatuses.map((provider) => (
          <div className="provider-pill" key={provider.provider}>
            <strong>{provider.provider}</strong>
            <span>{provider.mode}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
