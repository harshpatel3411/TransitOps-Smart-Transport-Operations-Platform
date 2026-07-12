import { createResourceStore } from "./createResourceStore";
import { fuelLogsApi, expensesApi } from "../api/fuelExpenses";

export const useFuelLogsStore = createResourceStore(fuelLogsApi, { successLabel: "Fuel log" });
export const useExpensesStore = createResourceStore(expensesApi, { successLabel: "Expense" });
