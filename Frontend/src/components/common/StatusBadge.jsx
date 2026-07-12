// Signature element: mono-set "plate" badge with a status dot.
// One component, color-coded, reused everywhere.
const STATUS_STYLES = {
  Available: { dot: "bg-[var(--color-success)]", text: "text-[var(--color-success)]", bg: "bg-[var(--color-success-bg)]" },
  Active: { dot: "bg-[var(--color-success)]", text: "text-[var(--color-success)]", bg: "bg-[var(--color-success-bg)]" },
  "On Trip": { dot: "bg-[var(--color-info)]", text: "text-[var(--color-info)]", bg: "bg-[var(--color-info-bg)]" },
  Dispatched: { dot: "bg-[var(--color-info)]", text: "text-[var(--color-info)]", bg: "bg-[var(--color-info-bg)]" },
  "In Shop": { dot: "bg-[var(--color-accent)]", text: "text-[#8a5a12]", bg: "bg-[#FBF0DD]" },
  "Off Duty": { dot: "bg-[var(--color-text-muted)]", text: "text-[var(--color-text-muted)]", bg: "bg-[var(--color-muted-bg)]" },
  Draft: { dot: "bg-[var(--color-text-muted)]", text: "text-[var(--color-text-muted)]", bg: "bg-[var(--color-muted-bg)]" },
  Retired: { dot: "bg-[var(--color-text-muted)]", text: "text-[var(--color-text-muted)]", bg: "bg-[var(--color-muted-bg)]" },
  Suspended: { dot: "bg-[var(--color-danger)]", text: "text-[var(--color-danger)]", bg: "bg-[var(--color-danger-bg)]" },
  Cancelled: { dot: "bg-[var(--color-danger)]", text: "text-[var(--color-danger)]", bg: "bg-[var(--color-danger-bg)]" },
  Completed: { dot: "bg-[var(--color-success)]", text: "text-[var(--color-success)]", bg: "bg-[var(--color-success-bg)]" },
  Closed: { dot: "bg-[var(--color-text-muted)]", text: "text-[var(--color-text-muted)]", bg: "bg-[var(--color-muted-bg)]" },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || {
    dot: "bg-[var(--color-text-muted)]",
    text: "text-[var(--color-text-muted)]",
    bg: "bg-[var(--color-muted-bg)]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
