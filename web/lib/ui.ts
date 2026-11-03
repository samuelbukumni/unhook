// Shared Tailwind class names so every page (list, detail, add, cancel,
// reminders) uses the same container, headings, buttons, inputs, and cards.
// Focus rings for all links and controls live in app/globals.css.
//
// Palette: zinc monochrome with one deep-green accent (money kept, not spent).

/** The <main> container on every page. */
export const pageClass = "mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:py-10";

export const h1Class = "text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50";
export const h2Class = "text-lg font-medium text-zinc-900 dark:text-zinc-100";
export const mutedClass = "text-zinc-600 dark:text-zinc-400";

export const backLinkClass = "self-start text-sm text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100";

export const primaryButtonClass =
  "inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-600 active:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300 dark:active:bg-emerald-500";
export const dangerButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-red-300 px-4 py-2 text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40";

export const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 transition-colors placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500";

export const cardClass = "rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900";
export const emptyStateClass =
  "flex flex-col items-start gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400";
export const alertClass =
  "rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200";
