import { parse } from "csv-parse/sync";
import { createHttpError } from "../../utils/httpError.js";

const numericFields = [
  "cost",
  "usageHours",
  "utilizationPct",
  "storageGb",
  "storageUsedPct",
  "cpuAvgPct",
  "memoryAvgPct",
];

function normalizeRow(row) {
  const record = { ...row };

  numericFields.forEach((field) => {
    if (record[field] !== undefined && record[field] !== "") {
      record[field] = Number(record[field]);
    }
  });

  record.provider = record.provider || "AWS";
  record.month = record.month || new Date().toISOString().slice(0, 7);
  record.category = record.category || inferCategory(record.service);
  record.tags = {
    environment: row.environment || row["tags.environment"] || "production",
    owner: row.owner || row["tags.owner"] || "finops",
    criticality: row.criticality || row["tags.criticality"] || "medium",
  };

  return record;
}

function inferCategory(service = "") {
  const serviceName = service.toLowerCase();
  if (serviceName.includes("kubernetes") || serviceName.includes("eks")) {
    return "kubernetes";
  }
  if (
    serviceName.includes("ec2") ||
    serviceName.includes("virtual machine") ||
    serviceName.includes("compute engine")
  ) {
    return "compute";
  }
  if (serviceName.includes("storage") || serviceName.includes("s3")) {
    return "storage";
  }
  if (serviceName.includes("sql") || serviceName.includes("database")) {
    return "database";
  }
  if (serviceName.includes("lambda") || serviceName.includes("functions")) {
    return "serverless";
  }
  return "other";
}

export function parseBillingPayload(file) {
  if (!file) {
    throw createHttpError(400, "Billing file is required");
  }

  const raw = file.buffer.toString("utf8");
  const lowerName = file.originalname.toLowerCase();

  if (lowerName.endsWith(".json")) {
    const parsed = JSON.parse(raw);
    const records = Array.isArray(parsed) ? parsed : parsed.records;

    if (!Array.isArray(records)) {
      throw createHttpError(
        400,
        "JSON must contain an array or a { records: [] } object"
      );
    }

    return records.map(normalizeRow);
  }

  if (lowerName.endsWith(".csv")) {
    const rows = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    return rows.map(normalizeRow);
  }

  throw createHttpError(400, "Only CSV and JSON uploads are supported");
}
