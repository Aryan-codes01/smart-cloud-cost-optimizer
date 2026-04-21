import { v4 as uuid } from "uuid";
import { BillingRecord } from "../models/BillingRecord.js";
import { ActionLog } from "../models/ActionLog.js";
import { memoryStore } from "../data/memoryStore.js";
import { isDatabaseReady } from "../config/db.js";

function normalizeRecord(record) {
  return {
    ...record,
    id: record.id || record._id?.toString() || uuid(),
  };
}

export async function getBillingRecords() {
  if (isDatabaseReady()) {
    const records = await BillingRecord.find({}).lean();
    return records.map(normalizeRecord);
  }

  return memoryStore.billingRecords.map(normalizeRecord);
}

export async function seedDatabaseIfEmpty() {
  if (!isDatabaseReady()) {
    return;
  }

  const [billingCount, actionLogCount] = await Promise.all([
    BillingRecord.countDocuments(),
    ActionLog.countDocuments(),
  ]);

  if (billingCount === 0) {
    await BillingRecord.insertMany(memoryStore.billingRecords);
  }

  if (actionLogCount === 0) {
    await ActionLog.insertMany(memoryStore.actionLogs);
  }
}

export async function replaceBillingRecords(records) {
  const timestamp = new Date().toISOString();
  const normalizedRecords = records.map((record) => ({
    ...record,
    id: record.id || uuid(),
    updatedAt: timestamp,
    createdAt: record.createdAt || timestamp,
  }));

  if (isDatabaseReady()) {
    await BillingRecord.deleteMany({});
    await BillingRecord.insertMany(normalizedRecords);
  }

  memoryStore.billingRecords = normalizedRecords;
  return normalizedRecords;
}

export async function appendBillingRecords(records) {
  const timestamp = new Date().toISOString();
  const normalizedRecords = records.map((record) => ({
    ...record,
    id: record.id || uuid(),
    updatedAt: timestamp,
    createdAt: record.createdAt || timestamp,
  }));

  if (isDatabaseReady()) {
    await BillingRecord.insertMany(normalizedRecords);
  }

  memoryStore.billingRecords = [...memoryStore.billingRecords, ...normalizedRecords];
  return normalizedRecords;
}

export async function getActionLogs() {
  if (isDatabaseReady()) {
    const logs = await ActionLog.find({}).sort({ createdAt: -1 }).lean();
    return logs.map(normalizeRecord);
  }

  return [...memoryStore.actionLogs].reverse().map(normalizeRecord);
}

export async function appendActionLog(log) {
  const normalizedLog = {
    ...log,
    id: log.id || uuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isDatabaseReady()) {
    await ActionLog.create(normalizedLog);
  }

  memoryStore.actionLogs.push(normalizedLog);
  return normalizedLog;
}

export function getProviderSyncState() {
  return memoryStore.providerSync;
}

export function updateProviderSyncState(provider, data) {
  memoryStore.providerSync[provider] = {
    ...memoryStore.providerSync[provider],
    ...data,
  };
  return memoryStore.providerSync[provider];
}
