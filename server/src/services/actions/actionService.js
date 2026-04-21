import { appendActionLog, getActionLogs } from "../dataRepository.js";
import { env } from "../../config/env.js";
import { createHttpError } from "../../utils/httpError.js";

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

export async function executeAction(actionId, role) {
  if (!["admin", "devops"].includes(role)) {
    throw createHttpError(
      403,
      "Only Admin and DevOps roles can execute optimization actions"
    );
  }

  const log = await appendActionLog({
    actionId,
    type: "Manual execution",
    provider: actionId.includes("aws") ? "AWS" : "Multi-cloud",
    targetResource: actionId.replace("action-", ""),
    status: "Executed",
    scheduledAt: "Executed now",
    executedBy: role,
    savingsEstimate: 120,
    notes: "Demo execution recorded successfully.",
  });

  return log;
}

export async function loadRecentActionLogs() {
  return getActionLogs();
}
