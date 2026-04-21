import { Sidebar } from "./Sidebar.jsx";
import { TopBar } from "./TopBar.jsx";

export function AppShell({
  children,
  dashboard,
  role,
  cloud,
  onRoleChange,
  onCloudChange,
  onRefresh,
  feedback,
  error,
}) {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-content">
        <TopBar
          role={role}
          cloud={cloud}
          onRoleChange={onRoleChange}
          onCloudChange={onCloudChange}
          onRefresh={onRefresh}
          providerStatuses={dashboard?.providerStatuses}
        />

        {feedback ? <div className="banner success">{feedback}</div> : null}
        {error ? <div className="banner error">{error}</div> : null}

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
