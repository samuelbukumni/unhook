// The footer shown on every page: a short privacy note.

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-1 px-4 py-4 text-xs text-zinc-600 sm:flex-row dark:text-zinc-400 sm:items-center sm:justify-between">
        <p>Unhook — your data stays in this browser.</p>
        <p>Built for the Meta Global Hackathon.</p>
      </div>
    </footer>
  );
}
