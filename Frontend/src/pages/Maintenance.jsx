import { useEffect, useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import { useMaintenanceStore } from "../store/maintenanceStore";
import { useAvailableVehiclesStore } from "../store/vehiclesStore";
import DataTable from "../components/common/DataTable";
import FormModal from "../components/common/FormModal";
import FilterBar from "../components/common/FilterBar";
import StatusBadge from "../components/common/StatusBadge";
import RoleGuard from "../components/common/RoleGuard";
import { ROLES } from "../utils/roles";
import { formatDate, formatCurrency } from "../utils/formatters";

const STATUS_OPTIONS = ["Active", "Closed"].map((v) => ({ value: v, label: v }));

export default function Maintenance() {
  const { items, loading, fetch, createLog, closeLog } = useMaintenanceStore();
  const availableVehicles = useAvailableVehiclesStore();

  const [filters, setFilters] = useState({ status: "" });
  const [createOpen, setCreateOpen] = useState(false);
  const [closing, setClosing] = useState(null);

  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    fetch(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  function openCreate() {
    availableVehicles.fetch();
    setCreateOpen(true);
  }

  async function handleCreate(values) {
    const res = await createLog({
      vehicle_id: Number(values.vehicle_id),
      description: values.description,
      cost: Number(values.cost) || 0,
      start_date: values.start_date,
    });
    return !!res;
  }

  async function handleClose(values) {
    const res = await closeLog(closing.id, {
      end_date: values.end_date,
      cost: values.cost !== "" && values.cost !== undefined ? Number(values.cost) : undefined,
    });
    return res;
  }

  const createFields = [
    {
      name: "vehicle_id",
      label: "Vehicle",
      type: "select",
      required: true,
      options: availableVehicles.items.map((v) => ({ value: v.id, label: `${v.registration_number} — ${v.name_model}` })),
      fullWidth: true,
    },
    { name: "description", label: "Description", type: "textarea", required: true, fullWidth: true },
    { name: "cost", label: "Estimated Cost", type: "number", step: "0.01" },
    { name: "start_date", label: "Start Date", type: "date", required: true },
  ];

  const closeFields = [
    { name: "end_date", label: "End Date", type: "date", required: true },
    { name: "cost", label: "Final Cost", type: "number", step: "0.01" },
  ];

  const columns = [
    { key: "id", label: "#", sortable: true },
    { key: "vehicle_id", label: "Vehicle", render: (r) => r.vehicle_registration || r.vehicle_id },
    { key: "description", label: "Description" },
    { key: "cost", label: "Cost", sortable: true, render: (r) => formatCurrency(r.cost) },
    { key: "start_date", label: "Start", render: (r) => formatDate(r.start_date) },
    { key: "end_date", label: "End", render: (r) => formatDate(r.end_date) },
    { key: "status", label: "Status", sortable: true, render: (r) => <StatusBadge status={r.status} /> },
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
            <Plus size={16} /> Open Maintenance Log
          </button>
        </RoleGuard>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyTitle="No maintenance logs"
        emptyMessage="Opening a log moves the vehicle to In Shop automatically."
        actions={(row) => (
          <RoleGuard allow={[ROLES.FLEET_MANAGER]}>
            {row.status === "Active" && (
              <button
                onClick={() => setClosing(row)}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[var(--color-success)] hover:bg-[var(--color-success-bg)]"
              >
                <CheckCircle2 size={13} /> Close
              </button>
            )}
          </RoleGuard>
        )}
      />

      <FormModal
        open={createOpen}
        title="Open Maintenance Log"
        fields={createFields}
        initialValues={{}}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        submitLabel="Open Log"
      />

      <FormModal
        open={!!closing}
        title={`Close Maintenance Log #${closing?.id ?? ""}`}
        fields={closeFields}
        initialValues={{}}
        onClose={() => setClosing(null)}
        onSubmit={handleClose}
        submitLabel="Close Log"
      />
    </div>
  );
}
