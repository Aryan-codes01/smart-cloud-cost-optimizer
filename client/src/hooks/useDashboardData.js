import { useEffect, useState } from "react";
import {
  executeAction,
  fetchDashboard,
  syncProvider,
  uploadBillingFile,
} from "../api/client.js";

export function useDashboardData({ role, cloud }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchDashboard({ role, cloud });
      setDashboard(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [role, cloud]);

  async function uploadFile(file, strategy) {
    try {
      const result = await uploadBillingFile({ file, strategy, role });
      setFeedback(
        `Imported ${result.importedCount} records using ${result.strategy} mode.`
      );
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function syncCloudProvider(provider) {
    try {
      const result = await syncProvider({ provider, role });
      setFeedback(result.message);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function runAction(actionId) {
    try {
      const result = await executeAction({ actionId, role });
      setFeedback(`${result.actionId} executed successfully.`);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return {
    dashboard,
    loading,
    error,
    feedback,
    refreshDashboard: loadDashboard,
    uploadFile,
    syncCloudProvider,
    runAction,
  };
}
