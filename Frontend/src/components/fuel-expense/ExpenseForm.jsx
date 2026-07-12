import FormModal from "../common/FormModal";

const EXPENSE_TYPES = ["Toll", "Parking", "Fine", "Permit", "Other"].map((v) => ({ value: v, label: v }));

export default function ExpenseForm({ open, onClose, onSubmit, vehicleOptions = [] }) {
  const fields = [
    { name: "vehicle_id", label: "Vehicle", type: "select", required: true, options: vehicleOptions, fullWidth: true },
    { name: "type", label: "Type", type: "select", required: true, options: EXPENSE_TYPES },
    { name: "expense_date", label: "Date", type: "date", required: true },
    { name: "amount", label: "Amount", type: "number", step: "0.01", required: true },
    { name: "description", label: "Description", type: "textarea", fullWidth: true },
  ];

  return <FormModal open={open} title="Log Expense" fields={fields} initialValues={{}} onClose={onClose} onSubmit={onSubmit} submitLabel="Save Expense" />;
}
