import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useVehiclesStore } from "../store/vehiclesStore";
import DataTable from "../components/common/DataTable";
import ConfirmDialog from "../components/common/ConfirmDialog";
import FilterBar from "../components/common/FilterBar";
import StatusBadge from "../components/common/StatusBadge";
import RoleGuard from "../components/common/RoleGuard";
import VehicleForm from "../components/vehicles/VehicleForm";
import { ROLES } from "../utils/roles";
import { formatCurrency } from "../utils/formatters";

const TYPE_OPTIONS = ["Truck", "Van", "Bus", "Pickup", "Trailer"].map((v) => ({ value: v, label: v }));
const STATUS_OPTIONS = ["Available", "On Trip", "In Shop", "Retired"].map((v) => ({ value: v, label: v }));

const FIELDS = (isEdit) => [
  { name: "registration_number", label: "Registration Number", required: true, placeholder: "GJ-01-AB-1234" },
  { name: "name_model", label: "Name / Model", required: true, placeholder: "Tata Ace" },
  { name: "type", label: "Type", type: "select", options: TYPE_OPTIONS, required: true },
  { name: "max_load_capacity", label: "Max Load Capacity (kg)", type: "number", step: "0.01", required: true },
  { name: "odometer", label: "Odometer (km)", type: "number", step: "0.01" },
  { name: "acquisition_cost", label: "Acquisition Cost", type: "number", step: "0.01", required: true },
  { name: "region", label: "Region" },
  ...(isEdit ? [{ name: "status", label: "Status", type: "select", options: STATUS_OPTIONS }] : []),
];

export default function Vehicles() {
  const { items, loading, fetch, create, update, remove } = useVehiclesStore();
  const [filters, setFilters] = useState({ status: "", type: "", region: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetch(cleanParams(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  function cleanParams(f) {
    const out = {};
    Object.entries(f).forEach(([k, v]) => {
      if (v) out[k] = v;
    });
    return out;
  }

  async function handleSubmit(values) {
    if (editing) {
      const res = await update(editing.id, values);
      return !!res;
    }
    const res = await create(values);
    return !!res;
  }

  async function handleDelete() {
    setDeleteLoading(true);
    const ok = await remove(deleting.id);
    setDeleteLoading(false);
    if (ok) setDeleting(null);
  }

  const columns = [
    { key: "registration_number", label: "Reg. No.", sortable: true, render: (r) => <span style={{ fontFamily: "var(--font-mono)" }}>{r.registration_number}</span> },
    { key: "name_model", label: "Model", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "max_load_capacity", label: "Max Load (kg)", sortable: true },
    { key: "region", label: "Region" },
    { key: "acquisition_cost", label: "Cost", sortable: true, render: (r) => formatCurrency(r.acquisition_cost) },
    { key: "status", label: "Status", sortable: true, render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterBar
          filters={[
            { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
            { name: "type", label: "Type", type: "select", options: TYPE_OPTIONS },
            { name: "region", label: "Region", type: "text", placeholder: "e.g. Gujarat" },
          ]}
          values={filters}
          onChange={(name, value) => setFilters((f) => ({ ...f, [name]: value }))}
        />
        <RoleGuard allow={[ROLES.FLEET_MANAGER]}>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--color-ink)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus size={16} /> Add Vehicle
          </button>
        </RoleGuard>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyTitle="No vehicles yet"
        emptyMessage="Add your first vehicle to start building trips against it."
        actions={(row) => (
          <RoleGuard allow={[ROLES.FLEET_MANAGER]}>
            <div className="flex justify-end gap-1">
              <button
                onClick={() => {
                  setEditing(row);
                  setModalOpen(true);
                }}
                className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-muted-bg)] hover:text-[var(--color-ink)]"
                aria-label="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => setDeleting(row)}
                className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger)]"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </RoleGuard>
        )}
      />

      <VehicleForm
        open={modalOpen}
        editing={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete vehicle"
        message={`Delete ${deleting?.registration_number}? This can't be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
