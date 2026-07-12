export default function Spinner({ size = 20, className = "" }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size, color: "var(--color-accent)" }}
      role="status"
      aria-label="Loading"
    />
  );
}
