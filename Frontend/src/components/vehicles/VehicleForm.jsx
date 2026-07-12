import FormModal from "../common/FormModal";

const TYPE_OPTIONS = ["Truck", "Van", "Bus", "Pickup", "Trailer"].map((v) => ({ value: v, label: v }));
const STATUS_OPTIONS = ["Available", "On Trip", "In Shop", "Retired"].map((v) => ({ value: v, label: v }));

export default function VehicleForm({ open, editing, onClose, onSubmit }) {
  const fields = [
    { name: "registration_number", label: "Registration Number", required: true, placeholder: "GJ-01-AB-1234" },
    { name: "name_model", label: "Name / Model", required: true, placeholder: "Tata Ace" },
    { name: "type", label: "Type", type: "select", options: TYPE_OPTIONS, required: true },
    { name: "max_load_capacity", label: "Max Load Capacity (kg)", type: "number", step: "0.01", required: true },
    { name: "odometer", label: "Odometer (km)", type: "number", step: "0.01" },
    { name: "acquisition_cost", label: "Acquisition Cost", type: "number", step: "0.01", required: true },
    { name: "region", label: "Region" },
    ...(editing ? [{ name: "status", label: "Status", type: "select", options: STATUS_OPTIONS }] : []),
  ];

  return (
    <FormModal
      open={open}
      title={editing ? "Edit Vehicle" : "Add Vehicle"}
      fields={fields}
      initialValues={editing || {}}
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel={editing ? "Save Changes" : "Create Vehicle"}
    />
  );
}
