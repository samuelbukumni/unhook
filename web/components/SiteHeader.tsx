// The header shown on every page: the Unhook name (links home) and the main
// navigation. The links that highlight the current page are a Client
// Component inside Suspense, because reading the URL can wait for request
// time on pages with dynamic ids.

import Link from "next/link";
import { Suspense } from "react";
import { NAV_LINKS } from "@/lib/nav";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Unhook
        </Link>
        <nav aria-label="Main">
          <Suspense fallback={<PlainLinks />}>
            <NavLinks />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

/** Same links without the current-page highlight, shown until the URL is known. */
function PlainLinks() {
  return (
    <ul className="flex items-center gap-0.5 text-sm sm:gap-1">
      {NAV_LINKS.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="rounded-lg px-2 py-2 text-zinc-600 hover:bg-zinc-100 sm:px-3 dark:text-zinc-300 dark:hover:bg-zinc-900">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
