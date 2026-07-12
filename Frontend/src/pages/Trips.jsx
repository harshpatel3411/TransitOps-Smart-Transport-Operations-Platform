import { useEffect, useState } from "react";
import { Plus, Send, CheckCircle2, XCircle } from "lucide-react";
import { useTripsStore } from "../store/tripsStore";
import { useAvailableVehiclesStore } from "../store/vehiclesStore";
import { useAvailableDriversStore } from "../store/driversStore";
import DataTable from "../components/common/DataTable";
import ConfirmDialog from "../components/common/ConfirmDialog";
import FormModal from "../components/common/FormModal";
import TripForm from "../components/trips/TripForm";
import FilterBar from "../components/common/FilterBar";
import StatusBadge from "../components/common/StatusBadge";
import RoleGuard from "../components/common/RoleGuard";
import { ROLES } from "../utils/roles";
import { formatDateTime } from "../utils/formatters";

const STATUS_OPTIONS = ["Draft", "Dispatched", "Completed", "Cancelled"].map((v) => ({ value: v, label: v }));

export default function Trips() {
  const { items, loading, fetch, createTrip, dispatchTrip, completeTrip, cancelTrip } = useTripsStore();
  const availableVehicles = useAvailableVehiclesStore();
  const availableDrivers = useAvailableDriversStore();

  const [filters, setFilters] = useState({ status: "" });
  const [createOpen, setCreateOpen] = useState(false);
  const [completing, setCompleting] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    fetch(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  function openCreate() {
    availableVehicles.fetch();
    availableDrivers.fetch();
    setCreateOpen(true);
  }

  async function handleCreate(values) {
    const res = await createTrip({
      source: values.source,
      destination: values.destination,
      vehicle_id: Number(values.vehicle_id),
      driver_id: Number(values.driver_id),
      cargo_weight: Number(values.cargo_weight),
      planned_distance: Number(values.planned_distance),
    });
    return !!res;
  }

  async function handleDispatch(trip) {
    setDispatchingId(trip.id);
    await dispatchTrip(trip.id);
    setDispatchingId(null);
  }

  async function handleComplete(values) {
    const res = await completeTrip(completing.id, {
      actual_distance: Number(values.actual_distance),
      fuel_consumed: Number(values.fuel_consumed),
    });
    return res;
  }

  async function handleCancel() {
    setCancelLoading(true);
    const ok = await cancelTrip(cancelling.id);
    setCancelLoading(false);
    if (ok) setCancelling(null);
  }

  const createFields = [
    { name: "source", label: "Source", required: true, fullWidth: true },
    { name: "destination", label: "Destination", required: true, fullWidth: true },
    {
      name: "vehicle_id",
      label: "Vehicle",
      type: "select",
      required: true,
      options: availableVehicles.items.map((v) => ({
        value: v.id,
        label: `${v.registration_number} — ${v.name_model} (max ${v.max_load_capacity}kg)`,
      })),
    },
    {
      name: "driver_id",
      label: "Driver",
      type: "select",
      required: true,
      options: availableDrivers.items.map((d) => ({ value: d.id, label: `${d.name} (${d.license_number})` })),
    },
    { name: "cargo_weight", label: "Cargo Weight (kg)", type: "number", step: "0.01", required: true },
    { name: "planned_distance", label: "Planned Distance (km)", type: "number", step: "0.01", required: true },
  ];

  const completeFields = [
    { name: "actual_distance", label: "Actual Distance (km)", type: "number", step: "0.01", required: true },
    { name: "fuel_consumed", label: "Fuel Consumed (L)", type: "number", step: "0.01", required: true },
  ];

  const columns = [
    { key: "id", label: "#", sortable: true },
    { key: "source", label: "Source" },
    { key: "destination", label: "Destination" },
    { key: "vehicle_id", label: "Vehicle", render: (r) => r.vehicle_registration || r.vehicle_id },
    { key: "driver_id", label: "Driver", render: (r) => r.driver_name || r.driver_id },
    { key: "cargo_weight", label: "Cargo (kg)" },
    { key: "planned_distance", label: "Planned (km)" },
    { key: "status", label: "Status", sortable: true, render: (r) => <StatusBadge status={r.status} /> },
    { key: "created_at", label: "Created", render: (r) => formatDateTime(r.created_at) },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterBar
          filters={[{ name: "status", label: "Status", type: "select", options: STATUS_OPTIONS }]}
          values={filters}
          onChange={(name, value) => setFilters((f) => ({ ...f, [name]: value }))}
        />
        <RoleGuard allow={[ROLES.FLEET_MANAGER]}>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--color-ink)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus size={16} /> New Trip
          </button>
        </RoleGuard>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyTitle="No trips yet"
        emptyMessage="Create a draft trip and dispatch it once a vehicle and driver are ready."
        actions={(row) => (
          <RoleGuard allow={[ROLES.FLEET_MANAGER]}>
            <div className="flex justify-end gap-1">
              {row.status === "Draft" && (
                <button
                  onClick={() => handleDispatch(row)}
                  disabled={dispatchingId === row.id}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[var(--color-info)] hover:bg-[var(--color-info-bg)] disabled:opacity-50"
                >
                  <Send size={13} /> {dispatchingId === row.id ? "Dispatching…" : "Dispatch"}
                </button>
              )}
              {row.status === "Dispatched" && (
                <>
                  <button
                    onClick={() => setCompleting(row)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[var(--color-success)] hover:bg-[var(--color-success-bg)]"
                  >
                    <CheckCircle2 size={13} /> Complete
                  </button>
                  <button
                    onClick={() => setCancelling(row)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)]"
                  >
                    <XCircle size={13} /> Cancel
                  </button>
                </>
              )}
            </div>
          </RoleGuard>
        )}
      />

      <TripForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        availableVehicles={availableVehicles.items}
        availableDrivers={availableDrivers.items}
      />

      <FormModal
        open={!!completing}
        title={`Complete Trip #${completing?.id ?? ""}`}
        fields={completeFields}
        initialValues={{}}
        onClose={() => setCompleting(null)}
        onSubmit={handleComplete}
        submitLabel="Mark Completed"
      />

      <ConfirmDialog
        open={!!cancelling}
        title="Cancel trip"
        message={`Cancel trip #${cancelling?.id}? The vehicle and driver will be freed up again.`}
        confirmLabel="Cancel Trip"
        danger
        loading={cancelLoading}
        onConfirm={handleCancel}
        onCancel={() => setCancelling(null)}
      />
    </div>
  );
}
