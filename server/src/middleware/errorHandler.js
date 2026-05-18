export function notFoundHandler(request, response) {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
}

export function errorHandler(error, _request, response, _next) {
  const status =
    error.status ||
    (error.name === "MulterError"
      ? error.code === "LIMIT_FILE_SIZE"
        ? 413
        : 400
      : 500);
  const message =
    error.name === "MulterError"
      ? error.code === "LIMIT_FILE_SIZE"
        ? "Uploaded file must be 2 MB or smaller"
        : "Only CSV and JSON uploads are supported"
      : error.message || "Unexpected server error";

  response.status(status).json({
    success: false,
    message,
    details: error.details,
  });
}
