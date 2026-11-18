export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 ${className ?? ""}`}>
      {children}
    </div>
  );
}
