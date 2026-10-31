// Reminders page at /reminders: what Unhook would remind you about in the
// next 7 days, plus a button to try a browser notification. The list is a
// Client Component because the data lives in the browser.

import { RemindersView } from "@/components/RemindersView";
import { h1Class, mutedClass, pageClass } from "@/lib/ui";

export const metadata = { title: "Reminders · Unhook" };

export default function RemindersPage() {
  return (
    <main className={pageClass}>
      <div>
        <h1 className={h1Class}>Reminders</h1>
        <p className={mutedClass}>3 days before, 1 day before, and on the day of each renewal or trial end.</p>
      </div>
      <RemindersView />
    </main>
  );
}
