export default function KPICard({ label, value, accent = "var(--color-accent)", suffix = "" }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-4 pl-5 relative overflow-hidden">
      <span className="absolute left-0 top-0 h-full w-1.5" style={{ backgroundColor: accent }} />
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold text-[var(--color-ink)]" style={{ fontFamily: "var(--font-mono)" }}>
        {value}
        {suffix && <span className="text-base font-medium text-[var(--color-text-muted)]"> {suffix}</span>}
      </p>
    </div>
  );
}
