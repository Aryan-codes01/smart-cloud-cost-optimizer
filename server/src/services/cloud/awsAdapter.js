import { appendBillingRecords } from "../dataRepository.js";
import { env, providerConfig } from "../../config/env.js";
import { roundCurrency } from "../../utils/formatters.js";

function monthKey(date) {
  return date.toISOString().slice(0, 7);
}

function inferCategory(service = "") {
  const value = service.toLowerCase();
  if (value.includes("ec2")) {
    return "compute";
  }
  if (value.includes("s3")) {
    return "storage";
  }
  if (value.includes("eks")) {
    return "kubernetes";
  }
  if (value.includes("lambda")) {
    return "serverless";
  }
  return "other";
}

export async function syncAwsLiveCosts() {
  if (!providerConfig.aws.accessKeyId || !providerConfig.aws.secretAccessKey) {
    return {
      provider: "AWS",
      synced: false,
      mode: "Upload mode",
      message:
        "AWS credentials are not configured. Dashboard continues with uploaded/mock data.",
    };
  }

  try {
    const { CostExplorerClient, GetCostAndUsageCommand } = await import(
      "@aws-sdk/client-cost-explorer"
    );

    const client = new CostExplorerClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: providerConfig.aws.accessKeyId,
        secretAccessKey: providerConfig.aws.secretAccessKey,
      },
    });

    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 3);

    const command = new GetCostAndUsageCommand({
      TimePeriod: {
        Start: start.toISOString().slice(0, 10),
        End: end.toISOString().slice(0, 10),
      },
      Granularity: "MONTHLY",
      Metrics: ["UnblendedCost"],
      GroupBy: [{ Type: "DIMENSION", Key: "SERVICE" }],
    });

    const result = await client.send(command);
    const records =
      result.ResultsByTime?.flatMap((timeRange) =>
        (timeRange.Groups || []).map((group) => ({
          provider: "AWS",
          accountId: "aws-live-ce",
          month: monthKey(new Date(timeRange.TimePeriod.Start)),
          service: group.Keys?.[0] || "Unknown AWS Service",
          category: inferCategory(group.Keys?.[0]),
          region: env.awsRegion,
          resourceId: `${group.Keys?.[0] || "service"}-${timeRange.TimePeriod.Start}`,
          resourceName: group.Keys?.[0] || "Unknown AWS Service",
          cost: roundCurrency(
            Number(group.Metrics?.UnblendedCost?.Amount || 0)
          ),
          usageHours: 720,
          utilizationPct: 45,
          tags: {
            environment: "production",
            owner: "finops",
            criticality: "high",
          },
        }))
      ) || [];

    if (records.length > 0) {
      await appendBillingRecords(records);
    }

    return {
      provider: "AWS",
      synced: true,
      mode: "Live billing API",
      message: `Imported ${records.length} live AWS cost records from Cost Explorer.`,
      importedCount: records.length,
    };
  } catch (error) {
    return {
      provider: "AWS",
      synced: false,
      mode: "Live-ready",
      message: `AWS live sync failed: ${error.message}`,
    };
  }
}
