import { useEffect, useState } from "react";
import Modal from "./Modal";

/**
 * fields: [{
 *   name, label, type: 'text'|'number'|'date'|'select'|'textarea',
 *   options?: [{value,label}] (for select),
 *   required?, step?, placeholder?, min?
 * }]
 */
export default function FormModal({ open, title, fields, initialValues = {}, onClose, onSubmit, submitLabel = "Save" }) {
  const [values, setValues] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, JSON.stringify(initialValues)]);

  function handleChange(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function validate() {
    const nextErrors = {};
    fields.forEach((f) => {
      if (f.required && (values[f.name] === undefined || values[f.name] === "" || values[f.name] === null)) {
        nextErrors[f.name] = `${f.label} is required.`;
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const ok = await onSubmit(values);
    setSubmitting(false);
    if (ok !== false) onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-muted-bg)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="generic-form-modal"
            disabled={submitting}
            className="rounded-lg bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Saving…" : submitLabel}
          </button>
        </>
      }
    >
      <form id="generic-form-modal" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.fullWidth ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              {f.label} {f.required && <span className="text-[var(--color-danger)]">*</span>}
            </label>

            {f.type === "select" ? (
              <select
                value={values[f.name] ?? ""}
                onChange={(e) => handleChange(f.name, e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ink)]"
              >
                <option value="" disabled>
                  Select {f.label.toLowerCase()}
                </option>
                {f.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                value={values[f.name] ?? ""}
                onChange={(e) => handleChange(f.name, e.target.value)}
                placeholder={f.placeholder}
                rows={3}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ink)]"
              />
            ) : (
              <input
                type={f.type || "text"}
                step={f.step}
                min={f.min}
                value={values[f.name] ?? ""}
                onChange={(e) =>
                  handleChange(f.name, f.type === "number" ? e.target.valueAsNumber || e.target.value : e.target.value)
                }
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ink)]"
              />
            )}
            {errors[f.name] && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors[f.name]}</p>}
          </div>
        ))}
      </form>
    </Modal>
  );
}
