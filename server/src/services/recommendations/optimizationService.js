import { roundCurrency } from "../../utils/formatters.js";

function currentMonthRecords(records) {
  const latestMonth = [...new Set(records.map((record) => record.month))]
    .sort()
    .at(-1);
  return records.filter((record) => record.month === latestMonth);
}

function createRecommendation({
  id,
  title,
  category,
  provider,
  resourceName,
  severity,
  monthlySavings,
  confidence,
  effort,
  reason,
  action,
  autoActionEligible = false,
}) {
  return {
    id,
    title,
    category,
    provider,
    resourceName,
    severity,
    monthlySavings: roundCurrency(monthlySavings),
    confidence,
    effort,
    reason,
    action,
    autoActionEligible,
    annualizedSavings: roundCurrency(monthlySavings * 12),
  };
}

export function generateRecommendations(records) {
  const latestRecords = currentMonthRecords(records);
  const recommendations = [];

  latestRecords.forEach((record) => {
    if (record.category === "compute" && (record.utilizationPct || 0) < 10) {
      recommendations.push(
        createRecommendation({
          id: `idle-${record.resourceId}`,
          title: "Idle compute resource detected",
          category: "Idle EC2 / VM",
          provider: record.provider,
          resourceName: record.resourceName,
          severity: "high",
          monthlySavings: (record.cost || 0) * 0.78,
          confidence: 0.94,
          effort: "Low",
          reason: `Average utilization is ${record.utilizationPct || 0}% with only ${
            record.usageHours || 0
          } active hours.`,
          action: "Stop instance after hours or convert workload to serverless",
          autoActionEligible: record.tags?.environment !== "production",
        })
      );
    }

    if (
      record.category === "storage" &&
      (record.storageUsedPct || record.utilizationPct || 0) < 40
    ) {
      recommendations.push(
        createRecommendation({
          id: `storage-${record.resourceId}`,
          title: "Underutilized storage tier",
          category: "Storage Optimization",
          provider: record.provider,
          resourceName: record.resourceName,
          severity: "medium",
          monthlySavings: (record.cost || 0) * 0.32,
          confidence: 0.86,
          effort: "Low",
          reason: `Only ${record.storageUsedPct || record.utilizationPct || 0}% of allocated storage is actively used.`,
          action: "Move cold data to a cheaper access tier and lifecycle old snapshots",
        })
      );
    }

    if (
      record.category === "compute" &&
      (record.utilizationPct || 0) < 35 &&
      (record.cost || 0) > 250
    ) {
      recommendations.push(
        createRecommendation({
          id: `rightsize-${record.resourceId}`,
          title: "Over-provisioned compute",
          category: "Rightsizing",
          provider: record.provider,
          resourceName: record.resourceName,
          severity: "high",
          monthlySavings: (record.cost || 0) * 0.24,
          confidence: 0.89,
          effort: "Medium",
          reason: `CPU stays near ${record.cpuAvgPct || record.utilizationPct || 0}% and memory near ${
            record.memoryAvgPct || 0
          }%.`,
          action: `Downsize to ${record.recommendedRightsize || "a smaller SKU"} with autoscaling guardrails`,
        })
      );
    }

    if (
      record.category === "compute" &&
      ["On-Demand", "PayAsYouGo", "OnDemand"].includes(record.purchaseOption) &&
      (record.cost || 0) > 500 &&
      (record.usageHours || 0) > 650
    ) {
      recommendations.push(
        createRecommendation({
          id: `reserved-${record.resourceId}`,
          title: "Reserved instance opportunity",
          category: "Reserved Instances",
          provider: record.provider,
          resourceName: record.resourceName,
          severity: "medium",
          monthlySavings: (record.cost || 0) * 0.28,
          confidence: 0.82,
          effort: "Low",
          reason: "The workload is stable across the month and still billed on flexible pricing.",
          action: "Purchase a 1-year reserved/committed plan for the baseline capacity",
        })
      );
    }

    if (
      record.category === "compute" &&
      record.tags?.environment !== "production" &&
      (record.usageHours || 0) < 160
    ) {
      recommendations.push(
        createRecommendation({
          id: `spot-${record.resourceId}`,
          title: "Spot/preemptible candidate",
          category: "Spot Instances",
          provider: record.provider,
          resourceName: record.resourceName,
          severity: "medium",
          monthlySavings: (record.cost || 0) * 0.55,
          confidence: 0.75,
          effort: "Medium",
          reason: "The workload is non-critical and lightly used, making it a good candidate for discounted compute.",
          action: "Shift dev or batch nodes to spot/preemptible pools",
          autoActionEligible: true,
        })
      );
    }

    if (record.category === "kubernetes" && (record.utilizationPct || 0) < 60) {
      recommendations.push(
        createRecommendation({
          id: `k8s-${record.resourceId}`,
          title: "Kubernetes requests exceed demand",
          category: "Kubernetes Cost",
          provider: record.provider,
          resourceName: record.resourceName,
          severity: "medium",
          monthlySavings: (record.cost || 0) * 0.18,
          confidence: 0.79,
          effort: "Medium",
          reason: `Cluster utilization is ${record.utilizationPct || 0}% and can support tighter requests/limits.`,
          action: "Tune namespace quotas, node pools, and horizontal autoscaling thresholds",
        })
      );
    }
  });

  return recommendations
    .sort((left, right) => right.monthlySavings - left.monthlySavings)
    .slice(0, 10);
}
