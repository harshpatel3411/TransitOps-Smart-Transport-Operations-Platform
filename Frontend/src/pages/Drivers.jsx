import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { useDriversStore } from "../store/driversStore";
import DataTable from "../components/common/DataTable";
import ConfirmDialog from "../components/common/ConfirmDialog";
import FilterBar from "../components/common/FilterBar";
import StatusBadge from "../components/common/StatusBadge";
import RoleGuard from "../components/common/RoleGuard";
import DriverForm from "../components/drivers/DriverForm";
import { ROLES } from "../utils/roles";
import { formatDate, isLicenseExpired } from "../utils/formatters";

const STATUS_OPTIONS = ["Available", "On Trip", "Off Duty", "Suspended"].map((v) => ({ value: v, label: v }));

const FIELDS = (isEdit) => [
  { name: "name", label: "Full Name", required: true },
  { name: "license_number", label: "License Number", required: true },
  { name: "license_category", label: "License Category", placeholder: "e.g. LMV, HMV" },
  { name: "license_expiry_date", label: "License Expiry Date", type: "date", required: true },
  { name: "contact_number", label: "Contact Number" },
  ...(isEdit ? [{ name: "status", label: "Status", type: "select", options: STATUS_OPTIONS }] : []),
];

export default function Drivers() {
  const { items, loading, fetch, create, update, remove } = useDriversStore();
  const [filters, setFilters] = useState({ status: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const canWriteDrivers = [ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER];

  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    fetch(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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
    { key: "name", label: "Name", sortable: true },
    { key: "license_number", label: "License No.", sortable: true, render: (r) => <span style={{ fontFamily: "var(--font-mono)" }}>{r.license_number}</span> },
    { key: "license_category", label: "Category" },
    {
      key: "license_expiry_date",
      label: "Expiry",
      sortable: true,
      render: (r) => (
        <span className={`inline-flex items-center gap-1 ${isLicenseExpired(r.license_expiry_date) ? "text-[var(--color-danger)] font-medium" : ""}`}>
          {isLicenseExpired(r.license_expiry_date) && <AlertTriangle size={13} />}
          {formatDate(r.license_expiry_date)}
        </span>
      ),
    },
    { key: "contact_number", label: "Contact" },
    { key: "safety_score", label: "Safety Score", sortable: true },
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
        <RoleGuard allow={canWriteDrivers}>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--color-ink)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus size={16} /> Add Driver
          </button>
        </RoleGuard>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyTitle="No drivers yet"
        emptyMessage="Add a driver so they can be assigned to trips."
        actions={(row) => (
          <RoleGuard allow={canWriteDrivers}>
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

      <DriverForm
        open={modalOpen}
        editing={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete driver"
        message={`Delete ${deleting?.name}? This can't be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
