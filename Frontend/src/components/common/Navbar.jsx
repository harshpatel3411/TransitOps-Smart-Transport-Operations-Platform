import { Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function Navbar({ title, onMenuClick }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-[var(--color-text)] hover:bg-[var(--color-muted-bg)] lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-[var(--color-ink)]" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-muted-bg)]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-muted-bg)]">
            <User size={14} />
          </span>
          <span className="hidden sm:inline">{user?.name || "Account"}</span>
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg">
              <div className="border-b border-[var(--color-border)] px-3 py-2">
                <p className="truncate text-sm font-medium text-[var(--color-text)]">{user?.name}</p>
                <p className="truncate text-xs text-[var(--color-text-muted)]">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)]"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
