// Shown for URLs that don't match any page.

import Link from "next/link";
import { h1Class, mutedClass, pageClass } from "@/lib/ui";

export default function NotFound() {
  return (
    <main className={pageClass}>
      <h1 className={h1Class}>Page not found</h1>
      <p className={mutedClass}>
        That page doesn&apos;t exist. <Link href="/" className="underline">See your subscriptions</Link>
      </p>
    </main>
  );
}
