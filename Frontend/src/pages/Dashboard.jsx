import { useEffect } from "react";
import { useDashboardStore } from "../store/dashboardStore";
import KPICard from "../components/common/KPICard";
import Spinner from "../components/common/Spinner";

export default function Dashboard() {
  const { kpis, loading, fetch } = useDashboardStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (loading && !kpis) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={28} />
      </div>
    );
  }

  const metrics = kpis || {};
  const cards = [
    { label: "Available Vehicles", value: metrics.availableVehicles ?? metrics.available_vehicles ?? metrics.totalVehicles ?? "—", accent: "var(--color-success)" },
    { label: "Vehicles In Shop", value: metrics.inMaintenance ?? metrics.in_maintenance ?? metrics.vehiclesInShop ?? "—", accent: "var(--color-accent)" },
    { label: "Active Trips", value: metrics.activeTrips ?? metrics.active_trips ?? "—", accent: "var(--color-info)" },
    { label: "Pending Trips", value: metrics.pendingTrips ?? metrics.pending_trips ?? "—", accent: "var(--color-text-muted)" },
    { label: "Drivers On Duty", value: metrics.driversOnDuty ?? metrics.drivers_on_duty ?? "—", accent: "var(--color-info)" },
    { label: "Fleet Utilization", value: metrics.utilization ?? metrics.utilization_pct ?? "—", accent: "var(--color-accent)", suffix: "%" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <KPICard key={c.label} {...c} />
        ))}
      </div>

      {!kpis && !loading && (
        <p className="mt-6 text-sm text-[var(--color-text-muted)]">
          No KPI data returned by the backend yet — check that <code className="rounded bg-[var(--color-muted-bg)] px-1 py-0.5">GET /api/dashboard/kpis</code> is reachable.
        </p>
      )}
    </div>
  );
}
