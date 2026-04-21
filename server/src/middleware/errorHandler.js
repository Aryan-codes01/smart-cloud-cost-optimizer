export function notFoundHandler(request, response) {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
}

export function errorHandler(error, _request, response, _next) {
  const status = error.status || 500;
  response.status(status).json({
    success: false,
    message: error.message || "Unexpected server error",
    details: error.details,
  });
}
