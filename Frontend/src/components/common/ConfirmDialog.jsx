import Modal from "./Modal";

export default function ConfirmDialog({ open, title = "Are you sure?", message, confirmLabel = "Confirm", danger = false, onConfirm, onCancel, loading }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm" footer={
      <>
        <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-muted-bg)]">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${danger ? "bg-[var(--color-danger)] hover:opacity-90" : "bg-[var(--color-ink)] hover:opacity-90"}`}
        >
          {loading ? "Working…" : confirmLabel}
        </button>
      </>
    }>
      <p className="text-sm text-[var(--color-text-muted)]">{message}</p>
    </Modal>
  );
}
