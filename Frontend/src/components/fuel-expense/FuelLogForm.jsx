import FormModal from "../common/FormModal";

export default function FuelLogForm({ open, onClose, onSubmit, vehicleOptions = [] }) {
  const fields = [
    { name: "vehicle_id", label: "Vehicle", type: "select", required: true, options: vehicleOptions, fullWidth: true },
    { name: "trip_id", label: "Trip ID (optional)", type: "number" },
    { name: "log_date", label: "Date", type: "date", required: true },
    { name: "liters", label: "Liters", type: "number", step: "0.01", required: true },
    { name: "cost", label: "Cost", type: "number", step: "0.01", required: true },
  ];

  return <FormModal open={open} title="Log Fuel" fields={fields} initialValues={{}} onClose={onClose} onSubmit={onSubmit} submitLabel="Save Fuel Log" />;
}
