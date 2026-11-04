"use client";

// Currency preferences: pick a display currency and save hand-entered
// exchange rates (estimates, never live data). Rates are stored per source
// currency with the date they were saved.

import { useState } from "react";
import { formatRate, type CurrencyPrefs } from "@/lib/currency";
import { saveCurrencyPrefs } from "@/lib/currency-prefs";
import { formatDate, toISODate } from "@/lib/dates";
import { useCurrencyPrefs } from "@/lib/use-currency";
import { useSubscriptions } from "@/lib/use-subscriptions";
import { cardClass, inputClass, mutedClass, selectClass } from "@/lib/ui";
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";

const COMMON_CURRENCIES = ["NGN", "USD", "EUR", "GBP"];

export function CurrencySettings() {
  const prefs = useCurrencyPrefs();
  const subscriptions = useSubscriptions();
  const [message, setMessage] = useState("");

  if (!prefs) return null;

  const inUse = [...new Set((subscriptions ?? []).map((sub) => sub.currency.toUpperCase()))];
  const sources = [...new Set([...COMMON_CURRENCIES, ...inUse])].filter((code) => code !== prefs.target);
  const entries = Object.entries(prefs.rates).sort(([a], [b]) => a.localeCompare(b));

  function handleTarget(event: React.ChangeEvent<HTMLSelectElement>) {
    saveCurrencyPrefs({ ...prefs!, target: event.target.value });
    setMessage(`Display currency set to ${event.target.value}.`);
  }

  function handleRate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const from = String(form.get("from") ?? "").toUpperCase();
    const rate = Number(form.get("rate"));
    if (!/^[A-Z]{3}$/.test(from) || !Number.isFinite(rate) || rate <= 0) return;
    const next: CurrencyPrefs = {
      ...prefs!,
      rates: { ...prefs!.rates, [from]: { rate, updatedAt: toISODate(new Date()) } },
    };
    saveCurrencyPrefs(next);
    setMessage(`Saved: 1 ${from} = ${formatRate(rate)} ${prefs!.target} (your estimate).`);
    event.currentTarget.reset();
  }

  return (
    <div className={`flex flex-col gap-4 ${cardClass}`}>
      <div>
        <h2 className="font-medium text-navy-900 dark:text-navy-50">Display currency</h2>
        <p className={`text-sm ${mutedClass}`}>
          Totals keep their original currency. Converted amounts use your rates below and are always
          labelled as estimates — Unhook doesn&apos;t fetch live exchange rates.
        </p>
      </div>

      <Field label="Preferred display currency">
        <select value={prefs.target} onChange={handleTarget} className={selectClass}>
          {COMMON_CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </Field>

      {entries.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm">
          {entries.map(([code, entry]) => (
            <li key={code} className="flex flex-wrap justify-between gap-2">
              <span>
                1 {code} = {formatRate(entry.rate)} {prefs.target}
              </span>
              <span className={mutedClass}>updated {formatDate(entry.updatedAt)}</span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleRate} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="From currency">
            <select name="from" required defaultValue={sources[0] ?? "USD"} className={selectClass}>
              {sources.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`Rate (1 unit = how many ${prefs.target}?)`}>
            <input name="rate" type="number" min="0" step="any" required placeholder="e.g. 1500" className={inputClass} />
          </Field>
        </div>
        <Button type="submit" className="self-start text-sm">
          Save rate
        </Button>
      </form>

      <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
        {message}
      </p>
    </div>
  );
}
