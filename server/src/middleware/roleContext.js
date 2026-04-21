export function attachRoleContext(request, _response, next) {
  request.role = request.headers["x-user-role"] || request.query.role || "admin";
  request.scope = request.query.scope || "all";
  next();
}
