import {
  executeAction,
  loadRecentActionLogs,
} from "../services/actions/actionService.js";

export async function runAction(request, response) {
  const result = await executeAction(request.params.actionId, request.role);

  response.json({
    success: true,
    message: "Action executed and logged successfully",
    data: result,
  });
}

export async function getActionLogsController(_request, response) {
  const logs = await loadRecentActionLogs();
  response.json({
    success: true,
    data: logs,
  });
}
