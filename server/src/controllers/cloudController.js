import {
  getProviderStatuses,
  syncProvider,
} from "../services/cloud/cloudSyncService.js";

export async function getProviders(_request, response) {
  response.json({
    success: true,
    data: getProviderStatuses(),
  });
}

export async function syncProviderController(request, response) {
  const result = await syncProvider(request.body.provider);

  response.json({
    success: true,
    message: result.message,
    data: result,
  });
}
