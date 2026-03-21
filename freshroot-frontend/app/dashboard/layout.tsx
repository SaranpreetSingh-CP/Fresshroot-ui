import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-green-800"
          >
            🌱 Freshroot Farms
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link
              href="/dashboard/customer"
              className="transition hover:text-green-700"
            >
              Customer
            </Link>
            <Link
              href="/dashboard/admin"
              className="transition hover:text-green-700"
            >
              Admin
            </Link>
            <Link
              href="/"
              className="rounded-full border border-gray-300 px-4 py-1.5 transition hover:bg-gray-100"
            >
              ← Back to Site
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
