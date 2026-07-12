export const ROLES = {
  FLEET_MANAGER: "Fleet Manager",
  DRIVER: "Driver",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst",
};

export const ALL_ROLES = Object.values(ROLES);

// Central permission matrix — one place to reason about who can write what.
export const PERMISSIONS = {
  vehicles: { write: [ROLES.FLEET_MANAGER] },
  drivers: { write: [ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER] },
  trips: { write: [ROLES.FLEET_MANAGER] },
  maintenance: { write: [ROLES.FLEET_MANAGER] },
  fuelExpenses: { write: [ROLES.FLEET_MANAGER] },
};

export function canWrite(section, role) {
  return PERMISSIONS[section]?.write?.includes(role) ?? false;
}

// Where each role lands after login
export function landingPathFor(role) {
  if (role === ROLES.FINANCIAL_ANALYST) return "/reports";
  return "/dashboard";
}
