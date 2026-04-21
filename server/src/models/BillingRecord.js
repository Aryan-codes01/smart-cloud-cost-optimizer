import mongoose from "mongoose";

const billingRecordSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["AWS", "Azure", "GCP"],
      required: true,
    },
    accountId: String,
    month: String,
    service: String,
    category: String,
    region: String,
    resourceId: String,
    resourceName: String,
    instanceType: String,
    purchaseOption: String,
    cost: Number,
    usageHours: Number,
    utilizationPct: Number,
    storageGb: Number,
    storageUsedPct: Number,
    kubernetesCluster: String,
    namespace: String,
    cpuAvgPct: Number,
    memoryAvgPct: Number,
    recommendedRightsize: String,
    tags: {
      environment: String,
      owner: String,
      criticality: String,
    },
  },
  { timestamps: true }
);

export const BillingRecord = mongoose.model(
  "BillingRecord",
  billingRecordSchema
);
