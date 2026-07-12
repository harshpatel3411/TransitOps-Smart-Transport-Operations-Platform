import FormModal from "../common/FormModal";

export default function TripForm({ open, onClose, onSubmit, availableVehicles = [], availableDrivers = [] }) {
  const fields = [
    { name: "source", label: "Source", required: true, fullWidth: true },
    { name: "destination", label: "Destination", required: true, fullWidth: true },
    {
      name: "vehicle_id",
      label: "Vehicle",
      type: "select",
      required: true,
      options: availableVehicles.map((v) => ({ value: v.id, label: `${v.registration_number} — ${v.name_model} (max ${v.max_load_capacity}kg)` })),
    },
    {
      name: "driver_id",
      label: "Driver",
      type: "select",
      required: true,
      options: availableDrivers.map((d) => ({ value: d.id, label: `${d.name} (${d.license_number})` })),
    },
    { name: "cargo_weight", label: "Cargo Weight (kg)", type: "number", step: "0.01", required: true },
    { name: "planned_distance", label: "Planned Distance (km)", type: "number", step: "0.01", required: true },
  ];

  return <FormModal open={open} title="New Trip" fields={fields} initialValues={{}} onClose={onClose} onSubmit={onSubmit} submitLabel="Create as Draft" />;
}
