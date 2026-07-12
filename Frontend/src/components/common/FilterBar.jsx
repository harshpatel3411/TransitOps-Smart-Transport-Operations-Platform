import { Search } from "lucide-react";

/**
 * filters: [{ name, label, type: 'text'|'select', options?: [{value,label}] }]
 * values: { [name]: value }
 * onChange(name, value)
 */
export default function FilterBar({ filters, values, onChange }) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      {filters.map((f) => (
        <div key={f.name} className="min-w-[150px]">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            {f.label}
          </label>
          {f.type === "select" ? (
            <select
              value={values[f.name] ?? ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-ink)]"
            >
              <option value="">All</option>
              {f.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                value={values[f.name] ?? ""}
                onChange={(e) => onChange(f.name, e.target.value)}
                placeholder={f.placeholder || "Search…"}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-8 pr-2.5 text-sm outline-none focus:border-[var(--color-ink)]"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
