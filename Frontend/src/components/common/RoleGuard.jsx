import { useAuthStore } from "../../store/authStore";

// Wraps write actions (buttons etc.) so only allowed roles see them.
// Usage: <RoleGuard allow={[ROLES.FLEET_MANAGER]}><button>Add Vehicle</button></RoleGuard>
function normalizeRole(role) {
  if (typeof role !== "string") return "";
  return role.trim().toLowerCase();
}

export default function RoleGuard({ allow = [], children, fallback = null }) {
  const role = useAuthStore((s) => s.user?.role);
  const normalizedRole = normalizeRole(role);
  const allowedRoles = allow.map((value) => normalizeRole(value));

  if (!normalizedRole || !allowedRoles.includes(normalizedRole)) return fallback;
  return children;
}
