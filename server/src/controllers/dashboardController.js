import { getBillingRecords, getActionLogs } from "../services/dataRepository.js";
import { buildDashboardPayload } from "../services/analytics/costAnalyticsService.js";
import { getProviderStatuses } from "../services/cloud/cloudSyncService.js";

export async function getDashboard(request, response) {
  const records = await getBillingRecords();
  const actionLogs = await getActionLogs();
  const providerStatuses = getProviderStatuses();

  const payload = buildDashboardPayload({
    records,
    actionLogs,
    providerStatuses,
    cloud: request.query.cloud || "all",
    role: request.role,
  });

  response.json({
    success: true,
    data: payload,
  });
}
