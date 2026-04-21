import {
  formatMonthLabel,
  groupBy,
  roundCurrency,
  sumValues,
} from "../../utils/formatters.js";
import { generateRecommendations } from "../recommendations/optimizationService.js";
import { buildForecast } from "../forecast/forecastService.js";
import { buildActionQueue } from "../actions/actionService.js";

function getLatestMonth(records) {
  return [...new Set(records.map((record) => record.month))].sort().at(-1);
}

function filterByCloud(records, cloud) {
  if (!cloud || cloud === "all") {
    return records;
  }
  return records.filter(
    (record) => record.provider.toLowerCase() === cloud.toLowerCase()
  );
}

function buildMonthlyTrend(records) {
  const grouped = groupBy(records, "month");
  return Object.entries(grouped)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([month, monthRecords]) => ({
      month,
      label: formatMonthLabel(month),
      cost: roundCurrency(sumValues(monthRecords, "cost")),
    }));
}

function buildBreakdown(records, key) {
  const grouped = groupBy(records, key);
  return Object.entries(grouped)
    .map(([name, group]) => ({
      name,
      cost: roundCurrency(sumValues(group, "cost")),
    }))
    .sort((left, right) => right.cost - left.cost);
}

function buildTopResources(records) {
  return [...records]
    .sort((left, right) => (right.cost || 0) - (left.cost || 0))
    .slice(0, 5)
    .map((record) => ({
      resourceName: record.resourceName,
      provider: record.provider,
      service: record.service,
      cost: roundCurrency(record.cost || 0),
      utilizationPct: record.utilizationPct || record.cpuAvgPct || 0,
      recommendation: record.recommendedRightsize || "Review allocation",
    }));
}

function buildKubernetesSummary(records) {
  return records
    .filter((record) => record.category === "kubernetes")
    .map((record) => ({
      cluster: record.kubernetesCluster || record.resourceName,
      namespace: record.namespace || "shared",
      provider: record.provider,
      cost: roundCurrency(record.cost || 0),
      cpuAvgPct: record.cpuAvgPct || 0,
      memoryAvgPct: record.memoryAvgPct || 0,
      efficiencyScore: Math.round(
        ((record.cpuAvgPct || 0) + (record.memoryAvgPct || 0)) / 2
      ),
    }))
    .sort((left, right) => right.cost - left.cost);
}

function buildRoleVisibility(role) {
  const normalizedRole = role.toLowerCase();
  return {
    canExecuteActions: ["admin", "devops"].includes(normalizedRole),
    showFinancePanels: ["admin", "finance"].includes(normalizedRole),
    showEngineeringPanels: ["admin", "devops"].includes(normalizedRole),
  };
}

export function buildDashboardPayload({
  records,
  actionLogs,
  providerStatuses,
  cloud = "all",
  role = "admin",
}) {
  const filteredRecords = filterByCloud(records, cloud);
  const latestMonth = getLatestMonth(filteredRecords);
  const latestMonthRecords = filteredRecords.filter(
    (record) => record.month === latestMonth
  );
  const monthlyTrend = buildMonthlyTrend(filteredRecords);
  const recommendations = generateRecommendations(filteredRecords);
  const forecast = buildForecast(monthlyTrend);
  const providerBreakdown = buildBreakdown(latestMonthRecords, "provider");
  const serviceBreakdown = buildBreakdown(latestMonthRecords, "service");
  const topResources = buildTopResources(latestMonthRecords);
  const kubernetes = buildKubernetesSummary(latestMonthRecords);
  const actions = buildActionQueue(recommendations);
  const currentSpend = roundCurrency(sumValues(latestMonthRecords, "cost"));
  const previousSpend = monthlyTrend.at(-2)?.cost || currentSpend;
  const savingsPotential = roundCurrency(
    recommendations.reduce(
      (total, recommendation) => total + recommendation.monthlySavings,
      0
    )
  );

  return {
    cloud,
    role,
    roleVisibility: buildRoleVisibility(role),
    heroMetrics: [
      {
        label: "Current Monthly Spend",
        value: currentSpend,
        unit: "USD",
        trend: previousSpend
          ? roundCurrency(((currentSpend - previousSpend) / previousSpend) * 100)
          : 0,
        tone: currentSpend > previousSpend ? "warning" : "positive",
      },
      {
        label: "Potential Savings",
        value: savingsPotential,
        unit: "USD",
        trend: recommendations.length,
        tone: "positive",
      },
      {
        label: "Forecast Next Month",
        value: forecast.nextMonth,
        unit: "USD",
        trend: forecast.deltaPct,
        tone: forecast.deltaPct > 0 ? "warning" : "positive",
      },
      {
        label: "Automation Coverage",
        value: actions.length,
        unit: "actions",
        trend: actionLogs.length,
        tone: "neutral",
      },
    ],
    monthlyTrend,
    providerBreakdown,
    serviceBreakdown,
    topResources,
    recommendations,
    forecast,
    actions,
    recentActivity: actionLogs.slice(0, 5),
    providerStatuses,
    kubernetes,
    platformReadiness: [
      {
        label: "Idle Compute Detection",
        status: "Active",
        description: "Flags low-utilization EC2, VM, and Compute Engine resources.",
      },
      {
        label: "Storage Tiering",
        status: "Active",
        description: "Highlights cold data suitable for archive or cool tiers.",
      },
      {
        label: "Multi-cloud Visibility",
        status: "Ready",
        description: "AWS, Azure, and GCP data models are normalized in one dashboard.",
      },
      {
        label: "Auto-Action Mode",
        status: actions.some((action) => action.status === "Armed")
          ? "Armed"
          : "Approval Flow",
        description: "Safe execution flow with role-based manual approval.",
      },
    ],
  };
}
