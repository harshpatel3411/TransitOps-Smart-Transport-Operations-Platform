import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useFuelLogsStore, useExpensesStore } from "../store/fuelExpensesStore";
import { useVehiclesStore } from "../store/vehiclesStore";
import DataTable from "../components/common/DataTable";
import RoleGuard from "../components/common/RoleGuard";
import FuelLogForm from "../components/fuel-expense/FuelLogForm";
import ExpenseForm from "../components/fuel-expense/ExpenseForm";
import { ROLES } from "../utils/roles";
import { formatCurrency, formatDate } from "../utils/formatters";

const EXPENSE_TYPES = ["Toll", "Parking", "Fine", "Permit", "Other"].map((v) => ({ value: v, label: v }));

export default function FuelExpenses() {
  const fuel = useFuelLogsStore();
  const expenses = useExpensesStore();
  const vehicles = useVehiclesStore();

  const [tab, setTab] = useState("fuel");
  const [fuelModalOpen, setFuelModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  useEffect(() => {
    fuel.fetch();
    expenses.fetch();
    vehicles.fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vehicleOptions = vehicles.items.map((v) => ({ value: v.id, label: `${v.registration_number} — ${v.name_model}` }));

  async function handleFuelSubmit(values) {
    const res = await fuel.create({
      vehicle_id: Number(values.vehicle_id),
      trip_id: values.trip_id ? Number(values.trip_id) : null,
      liters: Number(values.liters),
      cost: Number(values.cost),
      log_date: values.log_date,
    });
    return !!res;
  }

  async function handleExpenseSubmit(values) {
    const res = await expenses.create({
      vehicle_id: Number(values.vehicle_id),
      type: values.type,
      amount: Number(values.amount),
      expense_date: values.expense_date,
      description: values.description,
    });
    return !!res;
  }

  const fuelFields = [
    { name: "vehicle_id", label: "Vehicle", type: "select", required: true, options: vehicleOptions, fullWidth: true },
    { name: "trip_id", label: "Trip ID (optional)", type: "number" },
    { name: "log_date", label: "Date", type: "date", required: true },
    { name: "liters", label: "Liters", type: "number", step: "0.01", required: true },
    { name: "cost", label: "Cost", type: "number", step: "0.01", required: true },
  ];

  const expenseFields = [
    { name: "vehicle_id", label: "Vehicle", type: "select", required: true, options: vehicleOptions, fullWidth: true },
    { name: "type", label: "Type", type: "select", required: true, options: EXPENSE_TYPES },
    { name: "expense_date", label: "Date", type: "date", required: true },
    { name: "amount", label: "Amount", type: "number", step: "0.01", required: true },
    { name: "description", label: "Description", type: "textarea", fullWidth: true },
  ];

  const fuelColumns = [
    { key: "vehicle_id", label: "Vehicle", render: (r) => r.vehicle_registration || r.vehicle_id },
    { key: "trip_id", label: "Trip #" },
    { key: "log_date", label: "Date", sortable: true, render: (r) => formatDate(r.log_date) },
    { key: "liters", label: "Liters", sortable: true },
    { key: "cost", label: "Cost", sortable: true, render: (r) => formatCurrency(r.cost) },
  ];

  const expenseColumns = [
    { key: "vehicle_id", label: "Vehicle", render: (r) => r.vehicle_registration || r.vehicle_id },
    { key: "type", label: "Type" },
    { key: "expense_date", label: "Date", sortable: true, render: (r) => formatDate(r.expense_date) },
    { key: "amount", label: "Amount", sortable: true, render: (r) => formatCurrency(r.amount) },
    { key: "description", label: "Description" },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
          {[
            { key: "fuel", label: "Fuel Logs" },
            { key: "expenses", label: "Expenses" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t.key ? "bg-[var(--color-ink)] text-white" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <RoleGuard allow={[ROLES.FLEET_MANAGER]}>
          {tab === "fuel" ? (
            <button
              onClick={() => setFuelModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-ink)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              <Plus size={16} /> Log Fuel
            </button>
          ) : (
            <button
              onClick={() => setExpenseModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-ink)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              <Plus size={16} /> Log Expense
            </button>
          )}
        </RoleGuard>
      </div>

      {tab === "fuel" ? (
        <DataTable columns={fuelColumns} rows={fuel.items} loading={fuel.loading} emptyTitle="No fuel logs yet" />
      ) : (
        <DataTable columns={expenseColumns} rows={expenses.items} loading={expenses.loading} emptyTitle="No expenses yet" />
      )}

      <FuelLogForm
        open={fuelModalOpen}
        onClose={() => setFuelModalOpen(false)}
        onSubmit={handleFuelSubmit}
        vehicleOptions={vehicleOptions}
      />

      <ExpenseForm
        open={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSubmit={handleExpenseSubmit}
        vehicleOptions={vehicleOptions}
      />
    </div>
  );
}
