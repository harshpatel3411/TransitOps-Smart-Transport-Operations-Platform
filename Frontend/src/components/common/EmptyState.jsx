import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Inbox size={28} className="text-[var(--color-text-muted)]" />
      <p className="font-medium text-[var(--color-text)]">{title}</p>
      {message && <p className="max-w-sm text-sm text-[var(--color-text-muted)]">{message}</p>}
      {action}
    </div>
  );
}
