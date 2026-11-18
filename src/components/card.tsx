export function Card({
  className,
  ...props
}: {
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      {...props}
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5 ${className ?? ""}`}
    />
  );
}
