import {
  appendActionLog,
  getActionLogs,
  getBillingRecords,
} from "../dataRepository.js";
import { env } from "../../config/env.js";
import { createHttpError } from "../../utils/httpError.js";
import { generateRecommendations } from "../recommendations/optimizationService.js";

export function buildActionQueue(recommendations) {
  return recommendations
    .filter(
      (recommendation) =>
        recommendation.autoActionEligible || recommendation.category === "Rightsizing"
    )
    .slice(0, 5)
    .map((recommendation, index) => ({
      id: `action-${recommendation.id}`,
      name: recommendation.action,
      provider: recommendation.provider,
      target: recommendation.resourceName,
      status:
        recommendation.autoActionEligible && env.autoActionMode
          ? "Armed"
          : "Approval needed",
      schedule: index % 2 === 0 ? "22:00 IST" : "Weekend low traffic",
      estimatedMonthlySavings: recommendation.monthlySavings,
      riskLevel: recommendation.severity === "high" ? "Medium" : "Low",
    }));
}

export async function getExecutableActions() {
  const records = await getBillingRecords();
  return buildActionQueue(generateRecommendations(records));
}

export async function executeAction(actionId, role) {
  if (!["admin", "devops"].includes(role)) {
    throw createHttpError(
      403,
      "Only Admin and DevOps roles can execute optimization actions"
    );
  }

  const executableActions = await getExecutableActions();
  const action = executableActions.find((entry) => entry.id === actionId);

  if (!action) {
    throw createHttpError(404, "Action is no longer available for execution");
  }

  const log = await appendActionLog({
    actionId,
    type: action.name,
    provider: action.provider,
    targetResource: action.target,
    status: "Executed",
    scheduledAt: action.schedule,
    executedBy: role,
    savingsEstimate: action.estimatedMonthlySavings,
    notes: "Execution recorded successfully.",
  });

  return log;
}

export async function loadRecentActionLogs() {
  return getActionLogs();
}
