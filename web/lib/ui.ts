// Shared Tailwind class names so every page (list, detail, add, cancel,
// reminders) uses the same container, headings, buttons, inputs, and cards.
// Focus rings for all links and controls live in app/globals.css.

/** The <main> container on every page. */
export const pageClass = "mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:py-10";

export const h1Class = "text-2xl font-semibold tracking-tight sm:text-3xl";
export const h2Class = "text-lg font-medium";
export const mutedClass = "text-zinc-600 dark:text-zinc-400";

export const backLinkClass = "self-start text-sm text-zinc-600 hover:underline dark:text-zinc-400";

export const primaryButtonClass =
  "inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300";
export const dangerButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-red-300 px-4 py-2 text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40";

export const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700";

export const cardClass = "rounded-xl border border-zinc-200 p-4 dark:border-zinc-800";
export const emptyStateClass =
  "flex flex-col gap-2 rounded-xl border border-dashed border-zinc-300 p-4 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400";
export const alertClass =
  "rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200";
