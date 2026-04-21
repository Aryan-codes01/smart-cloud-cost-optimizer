import { startTransition, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell.jsx";
import { useDashboardData } from "./hooks/useDashboardData.js";
import { ActionsPage } from "./pages/ActionsPage.jsx";
import { ArchitecturePage } from "./pages/ArchitecturePage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { KubernetesPage } from "./pages/KubernetesPage.jsx";
import { RecommendationsPage } from "./pages/RecommendationsPage.jsx";

export default function App() {
  const [role, setRole] = useState("admin");
  const [cloud, setCloud] = useState("all");
  const {
    dashboard,
    loading,
    error,
    feedback,
    refreshDashboard,
    uploadFile,
    syncCloudProvider,
    runAction,
  } = useDashboardData({ role, cloud });

  return (
    <BrowserRouter>
      <AppShell
        dashboard={dashboard}
        role={role}
        cloud={cloud}
        onRoleChange={(nextRole) => startTransition(() => setRole(nextRole))}
        onCloudChange={(nextCloud) => startTransition(() => setCloud(nextCloud))}
        onRefresh={refreshDashboard}
        feedback={feedback}
        error={error}
      >
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                dashboard={dashboard}
                loading={loading}
                onUpload={uploadFile}
                onSyncProvider={syncCloudProvider}
              />
            }
          />
          <Route
            path="/recommendations"
            element={<RecommendationsPage dashboard={dashboard} />}
          />
          <Route
            path="/actions"
            element={
              <ActionsPage
                dashboard={dashboard}
                onExecuteAction={runAction}
                loading={loading}
              />
            }
          />
          <Route path="/kubernetes" element={<KubernetesPage dashboard={dashboard} />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
