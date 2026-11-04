// Shared design tokens: Tailwind class strings so every page uses the same
// container, headings, buttons, inputs, labels, and cards.
// Palette: cream ground, navy ink, teal actions, forest-green positives,
// restrained red for destructive actions (see app/globals.css).
// Focus rings for all links and controls live in app/globals.css.

/** The <main> container on every page. */
export const pageClass = "mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:py-10";

export const h1Class = "text-2xl font-semibold tracking-tight text-navy-900 sm:text-3xl dark:text-navy-50";
export const h2Class = "text-lg font-medium text-navy-900 dark:text-navy-50";
export const mutedClass = "text-navy-600 dark:text-navy-100";

export const backLinkClass = "self-start text-sm text-navy-600 hover:text-navy-900 hover:underline dark:text-navy-100 dark:hover:text-white";
export const linkClass = "text-teal-700 underline-offset-2 hover:underline dark:text-teal-300";

export const primaryButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-600 active:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-400 dark:text-navy-950 dark:hover:bg-emerald-300";
export const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg border border-line bg-white px-4 py-2 font-medium text-navy-800 transition-colors hover:bg-cream disabled:opacity-50 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-50 dark:hover:bg-navy-800";
export const dangerButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg border border-red-300 px-4 py-2 font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40";
/** Compact primary action for the header navigation. */
export const navButtonClass =
  "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600 dark:bg-emerald-400 dark:text-navy-950 dark:hover:bg-emerald-300";

export const inputClass =
  "w-full min-h-10 rounded-lg border border-line bg-white px-3 py-2 text-navy-900 transition-colors placeholder:text-navy-600 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-50 dark:placeholder:text-navy-200";
/** Selects and date inputs share the text-input styling. */
export const selectClass = inputClass;
export const labelClass = "flex flex-col gap-1 text-sm text-navy-800 dark:text-navy-100";

export const cardClass =
  "rounded-xl border border-line bg-white p-4 shadow-[0_1px_2px_rgba(16,42,67,0.06)] dark:border-navy-800 dark:bg-navy-900 dark:shadow-none";
export const emptyStateClass =
  "flex flex-col items-start gap-3 rounded-xl border border-dashed border-line bg-paper p-5 text-navy-600 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100";
export const alertClass =
  "rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200";
