import { env } from "../config/env.js";

const allowedRoles = new Set(["admin", "devops", "finance"]);

function normalizeRole(role) {
  const normalizedRole = String(role || "").trim().toLowerCase();
  return allowedRoles.has(normalizedRole) ? normalizedRole : null;
}

export function attachRoleContext(request, _response, next) {
  const requestedRole = normalizeRole(
    request.headers["x-user-role"] || request.query.role
  );
  const defaultRole = normalizeRole(env.defaultRole) || "admin";
  const suppliedSecret = String(request.headers["x-role-override-secret"] || "");

  request.role =
    env.roleOverrideSecret &&
    suppliedSecret === env.roleOverrideSecret &&
    requestedRole
      ? requestedRole
      : defaultRole;
  request.scope = request.query.scope || "all";
  next();
}
