// The footer shown on every page: a short privacy note and the demo controls.

import { DemoControls } from "./DemoControls";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-2 px-4 py-4 text-xs text-zinc-600 sm:flex-row dark:text-zinc-400 sm:items-center sm:justify-between">
        <p>Your data stays in this browser (localStorage).</p>
        <DemoControls />
      </div>
    </footer>
  );
}
