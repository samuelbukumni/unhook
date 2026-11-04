"use client";

// Main navigation links. The link for the current section gets
// aria-current="page" and a highlighted style. "Add" is the primary action.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";
import { navButtonClass } from "@/lib/ui";
import { BellIcon, ChartIcon, ListIcon, PlusIcon } from "./icons";

const ICONS: Record<string, (props: { className?: string }) => React.ReactElement> = {
  "/": ListIcon,
  "/reminders": BellIcon,
  "/insights": ChartIcon,
  "/add": PlusIcon,
};

function isCurrent(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname.startsWith("/subscriptions");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex flex-wrap items-center justify-end gap-0.5 text-sm sm:gap-1">
      {NAV_LINKS.map((link) => {
        const current = isCurrent(pathname, link.href);
        const Icon = ICONS[link.href];
        if (link.href === "/add") {
          return (
            <li key={link.href}>
              <Link href={link.href} aria-current={current ? "page" : undefined} className={navButtonClass}>
                {Icon && <Icon />}
                {link.label}
              </Link>
            </li>
          );
        }
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 py-2 transition-colors hover:bg-navy-100 sm:px-3 dark:hover:bg-navy-800 ${
                current
                  ? "bg-teal-50 font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-200"
                  : "text-navy-600 dark:text-navy-100"
              }`}
            >
              {Icon && <Icon />}
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
