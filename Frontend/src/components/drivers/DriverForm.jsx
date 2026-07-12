import FormModal from "../common/FormModal";

const STATUS_OPTIONS = ["Available", "On Trip", "Off Duty", "Suspended"].map((v) => ({ value: v, label: v }));

export default function DriverForm({ open, editing, onClose, onSubmit }) {
  const fields = [
    { name: "name", label: "Full Name", required: true },
    { name: "license_number", label: "License Number", required: true },
    { name: "license_category", label: "License Category", placeholder: "e.g. LMV, HMV" },
    { name: "license_expiry_date", label: "License Expiry Date", type: "date", required: true },
    { name: "contact_number", label: "Contact Number" },
    ...(editing ? [{ name: "status", label: "Status", type: "select", options: STATUS_OPTIONS }] : []),
  ];

  return (
    <FormModal
      open={open}
      title={editing ? "Edit Driver" : "Add Driver"}
      fields={fields}
      initialValues={editing || {}}
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel={editing ? "Save Changes" : "Create Driver"}
    />
  );
}
