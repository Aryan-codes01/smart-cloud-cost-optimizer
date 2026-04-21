import {
  appendBillingRecords,
  replaceBillingRecords,
} from "../dataRepository.js";
import { parseBillingPayload } from "./parserService.js";

export async function ingestBillingUpload(file, strategy = "append") {
  const records = parseBillingPayload(file);

  if (strategy === "replace") {
    await replaceBillingRecords(records);
  } else {
    await appendBillingRecords(records);
  }

  return {
    importedCount: records.length,
    strategy,
    providers: [...new Set(records.map((record) => record.provider))],
  };
}
