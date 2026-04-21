import { ingestBillingUpload } from "../services/ingestion/uploadService.js";

export async function uploadBillingData(request, response) {
  const strategy = request.body.strategy || "append";
  const result = await ingestBillingUpload(request.file, strategy);

  response.status(201).json({
    success: true,
    message: "Billing data imported successfully",
    data: result,
  });
}
