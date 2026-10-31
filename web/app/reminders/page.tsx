// Reminders page at /reminders: what Unhook would remind you about in the
// next 7 days, plus a button to try a browser notification. The list is a
// Client Component because the data lives in the browser.

import { RemindersView } from "@/components/RemindersView";

export const metadata = { title: "Reminders · Unhook" };

export default function RemindersPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Reminders</h1>
        <p className="text-zinc-500">3 days before, 1 day before, and on the day of each renewal or trial end.</p>
      </div>
      <RemindersView />
    </main>
  );
}
