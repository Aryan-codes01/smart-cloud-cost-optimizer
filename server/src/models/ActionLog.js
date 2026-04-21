import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema(
  {
    actionId: { type: String, required: true },
    type: String,
    provider: String,
    targetResource: String,
    status: String,
    scheduledAt: String,
    executedBy: String,
    savingsEstimate: Number,
    notes: String,
  },
  { timestamps: true }
);

export const ActionLog = mongoose.model("ActionLog", actionLogSchema);
