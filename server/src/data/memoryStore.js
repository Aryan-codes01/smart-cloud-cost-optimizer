import { v4 as uuid } from "uuid";
import { mockBillingData } from "./mockBillingData.js";

const now = new Date().toISOString();

export const memoryStore = {
  billingRecords: mockBillingData.map((record) => ({
    id: uuid(),
    ...record,
    createdAt: now,
    updatedAt: now,
  })),
  actionLogs: [
    {
      id: uuid(),
      actionId: "action-stop-idle-dev-api-sandbox",
      type: "Shutdown idle instance",
      provider: "AWS",
      targetResource: "dev-api-sandbox",
      status: "Scheduled",
      scheduledAt: "22:00 IST",
      executedBy: "system",
      savingsEstimate: 92,
      notes: "Auto-action dry run enabled for non-production resources.",
      createdAt: now,
      updatedAt: now,
    },
  ],
  providerSync: {
    AWS: { lastSync: "2026-04-15T09:15:00Z", status: "Live-ready" },
    Azure: { lastSync: "2026-04-15T08:40:00Z", status: "Upload mode" },
    GCP: { lastSync: "2026-04-14T18:20:00Z", status: "Upload mode" },
  },
};
