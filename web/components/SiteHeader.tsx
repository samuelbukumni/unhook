// The header shown on every page: the Unhook brand (links home) and the main
// navigation. The links that highlight the current page are a Client
// Component inside Suspense, because reading the URL can wait for request
// time on pages with dynamic ids.

import Link from "next/link";
import { Suspense } from "react";
import { NAV_LINKS } from "@/lib/nav";
import { navButtonClass } from "@/lib/ui";
import { HookMark } from "./icons";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper dark:border-navy-800 dark:bg-navy-950">
      <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-navy-900 dark:text-navy-50">
          <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white dark:bg-emerald-400 dark:text-navy-950">
            <HookMark />
          </span>
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
    <ul className="flex flex-wrap items-center justify-end gap-0.5 text-sm sm:gap-1">
      {NAV_LINKS.map((link) =>
        link.href === "/add" ? (
          <li key={link.href}>
            <Link href={link.href} className={navButtonClass}>
              {link.label}
            </Link>
          </li>
        ) : (
          <li key={link.href}>
            <Link href={link.href} className="inline-flex min-h-9 items-center rounded-lg px-2 py-2 text-navy-600 hover:bg-navy-100 sm:px-3 dark:text-navy-100 dark:hover:bg-navy-800">
              {link.label}
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}
