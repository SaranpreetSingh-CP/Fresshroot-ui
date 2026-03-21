"use client";

import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/utils/constants";
import { useUIStore } from "@/store";

export default function Navbar() {
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-green-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="text-xl font-bold tracking-tight text-green-800"
        >
          🌱 {SITE_NAME}
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium text-gray-700 transition hover:text-green-700"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/dashboard/customer"
              className="rounded-full bg-green-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Dashboard
            </Link>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-green-100 bg-white px-4 pb-4 md:hidden">
          <ul className="space-y-3 pt-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={closeMobileMenu}
                  className="block text-sm font-medium text-gray-700 transition hover:text-green-700"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/dashboard/customer"
                onClick={closeMobileMenu}
                className="block rounded-full bg-green-700 px-5 py-2 text-center text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
