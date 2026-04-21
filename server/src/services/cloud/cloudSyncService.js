import { providerConfig } from "../../config/env.js";
import { getProviderSyncState, updateProviderSyncState } from "../dataRepository.js";
import { syncAwsLiveCosts } from "./awsAdapter.js";
import { createHttpError } from "../../utils/httpError.js";

export function getProviderStatuses() {
  const syncState = getProviderSyncState();

  return [
    {
      provider: "AWS",
      configured: Boolean(
        providerConfig.aws.accessKeyId && providerConfig.aws.secretAccessKey
      ),
      mode: syncState.AWS?.status || "Upload mode",
      lastSync: syncState.AWS?.lastSync,
      capability: "Billing API + optimization findings",
    },
    {
      provider: "Azure",
      configured: Boolean(
        providerConfig.azure.subscriptionId &&
          providerConfig.azure.clientId &&
          providerConfig.azure.clientSecret
      ),
      mode: syncState.Azure?.status || "Upload mode",
      lastSync: syncState.Azure?.lastSync,
      capability: "Upload analytics + adapter-ready connector",
    },
    {
      provider: "GCP",
      configured: Boolean(
        providerConfig.gcp.projectId && providerConfig.gcp.credentialsPath
      ),
      mode: syncState.GCP?.status || "Upload mode",
      lastSync: syncState.GCP?.lastSync,
      capability: "Upload analytics + adapter-ready connector",
    },
  ];
}

export async function syncProvider(providerName) {
  const provider = providerName?.toUpperCase();

  if (provider === "AWS") {
    const result = await syncAwsLiveCosts();
    updateProviderSyncState("AWS", {
      lastSync: new Date().toISOString(),
      status: result.mode,
    });
    return result;
  }

  if (provider === "AZURE" || provider === "GCP") {
    const normalizedProvider = provider === "AZURE" ? "Azure" : "GCP";
    const result = {
      provider: normalizedProvider,
      synced: false,
      mode: "Upload mode",
      message:
        `${normalizedProvider} connector scaffold is ready. ` +
        "Use uploads now and extend this service with billing SDK credentials later.",
    };
    updateProviderSyncState(normalizedProvider, {
      lastSync: new Date().toISOString(),
      status: result.mode,
    });
    return result;
  }

  throw createHttpError(400, "Provider must be AWS, Azure, or GCP");
}
