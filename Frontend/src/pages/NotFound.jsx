import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[var(--color-bg)] p-4 text-center">
      <p className="text-6xl font-bold text-[var(--color-ink)]" style={{ fontFamily: "var(--font-display)" }}>
        404
      </p>
      <p className="text-[var(--color-text-muted)]">This route doesn't exist.</p>
      <Link to="/dashboard" className="mt-3 rounded-lg bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
        Back to Dashboard
      </Link>
    </div>
  );
}
