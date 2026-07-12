import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "react-toastify";
import { reportsApi } from "../api/reports";
import DataTable from "../components/common/DataTable";
import Spinner from "../components/common/Spinner";
import { formatCurrency, formatNumber } from "../utils/formatters";

const REPORTS = [
  { key: "fuel-efficiency", label: "Fuel Efficiency", fetcher: reportsApi.fuelEfficiency },
  { key: "utilization", label: "Utilization", fetcher: reportsApi.utilization },
  { key: "cost", label: "Cost", fetcher: reportsApi.cost },
  { key: "roi", label: "ROI", fetcher: reportsApi.roi },
];

// Column layout per report type — falls back to auto-generated columns
// if the backend returns fields we don't explicitly know about.
function columnsFor(reportKey, rows) {
  if (!rows || rows.length === 0) return [];
  const sample = rows[0];
  const knownRenderers = {
    fuel_efficiency: (r) => formatNumber(r.fuel_efficiency, 2),
    distance_per_liter: (r) => formatNumber(r.distance_per_liter, 2),
    utilization_pct: (r) => `${formatNumber(r.utilization_pct, 1)}%`,
    cost: (r) => formatCurrency(r.cost),
    total_cost: (r) => formatCurrency(r.total_cost),
    fuel_cost: (r) => formatCurrency(r.fuel_cost),
    maintenance_cost: (r) => formatCurrency(r.maintenance_cost),
    roi: (r) => `${formatNumber(r.roi, 2)}%`,
    revenue: (r) => formatCurrency(r.revenue),
    acquisition_cost: (r) => formatCurrency(r.acquisition_cost),
  };

  return Object.keys(sample).map((key) => ({
    key,
    label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    sortable: true,
    render: knownRenderers[key] ? (row) => knownRenderers[key](row) : undefined,
  }));
}

export default function Reports() {
  const [active, setActive] = useState("fuel-efficiency");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const report = REPORTS.find((r) => r.key === active);
    setLoading(true);
    report
      .fetcher()
      .then((res) => {
        const payload = res.data?.data ?? res.data;
        const normalized = Array.isArray(payload) ? payload : payload ? [payload] : [];
        setRows(normalized);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [active]);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await reportsApi.exportCsv(active);
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${active}-report.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report exported.");
    } catch (err) {
      // error toast already shown by axios interceptor
    } finally {
      setExporting(false);
    }
  }

  const columns = columnsFor(active, rows);

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
          {REPORTS.map((r) => (
            <button
              key={r.key}
              onClick={() => setActive(r.key)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                active === r.key ? "bg-[var(--color-ink)] text-white" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-muted-bg)] disabled:opacity-60"
        >
          {exporting ? <Spinner size={14} /> : <Download size={16} />}
          Export CSV
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No data for this report yet"
        emptyMessage="Once trips, fuel logs, and maintenance are recorded, this report will populate."
      />
    </div>
  );
}
