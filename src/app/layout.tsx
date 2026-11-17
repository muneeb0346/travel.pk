import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "travel.pk",
  description: "Flight search and route guides for Pakistan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <header className="border-b border-[var(--border)] bg-[var(--surface)]/90">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
              travel.pk
            </Link>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              Flight search
            </p>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}