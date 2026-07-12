import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  UserRound,
  Route as RouteIcon,
  Wrench,
  Fuel,
  BarChart3,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { ROLES } from "../../utils/roles";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: null },
  { to: "/vehicles", label: "Vehicles", icon: Truck, roles: null },
  { to: "/drivers", label: "Drivers", icon: UserRound, roles: null },
  { to: "/trips", label: "Trips", icon: RouteIcon, roles: null },
  { to: "/maintenance", label: "Maintenance", icon: Wrench, roles: null },
  { to: "/fuel-expenses", label: "Fuel & Expenses", icon: Fuel, roles: null },
  { to: "/reports", label: "Reports", icon: BarChart3, roles: null },
];

export default function Sidebar({ open, onNavigate }) {
  const role = useAuthStore((s) => s.user?.role);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 bg-[var(--color-ink)] text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-accent)] font-bold text-[var(--color-ink)]" style={{ fontFamily: "var(--font-display)" }}>
          T
        </div>
        <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          TransitOps
        </span>
      </div>

      <nav className="mt-2 flex flex-col gap-0.5 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-0 w-full px-5">
        <p className="text-[10px] uppercase tracking-wide text-white/40">Signed in as</p>
        <p className="truncate text-sm font-medium text-white/90">{role || "—"}</p>
      </div>
    </aside>
  );
}
