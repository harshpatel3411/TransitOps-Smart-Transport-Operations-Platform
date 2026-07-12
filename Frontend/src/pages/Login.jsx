import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { landingPathFor } from "../utils/roles";
import { toast } from "react-toastify";

export default function Login() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (token) {
    const from = location.state?.from?.pathname || landingPathFor(user?.role);
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter both email and password.");
      return;
    }
    const ok = await login(email, password);
    if (ok) {
      const role = useAuthStore.getState().user?.role;
      navigate(landingPathFor(role), { replace: true });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)] font-bold text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            T
          </div>
          <span className="text-2xl font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
            TransitOps
          </span>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl bg-[var(--color-surface)] p-6 shadow-xl">
          <h1 className="mb-1 text-lg font-semibold text-[var(--color-ink)]" style={{ fontFamily: "var(--font-display)" }}>
            Sign in
          </h1>
          <p className="mb-5 text-sm text-[var(--color-text-muted)]">Fleet operations console</p>

          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@fleet.com"
            className="mb-4 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-ink)]"
          />

          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mb-5 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-ink)]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--color-ink)] py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
