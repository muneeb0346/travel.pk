export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "text";
}

export function Button({
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--accent-soft)] disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    primary:
      "bg-[var(--accent)] text-[var(--accent-foreground)] transition-opacity hover:opacity-90",
    outline:
      "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-colors hover:bg-[var(--border)]",
    text:
      "text-[var(--foreground)] underline underline-offset-4 transition-colors hover:text-[var(--accent)]",
  };
  return (
    <button
      {...props}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    />
  );
}
