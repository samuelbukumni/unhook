"use client";

// "Test notification" button for the /reminders page. Uses the browser
// Notification API: permission is only requested when the button is clicked,
// and unsupported or blocked notifications get a visible explanation.
// This is only a test; Unhook doesn't schedule real push reminders yet.

import { useState } from "react";

type Result =
  | { kind: "idle" }
  | { kind: "working" }
  | { kind: "sent" }
  | { kind: "problem"; message: string };

export function NotificationTest({ body }: { body: string }) {
  const [result, setResult] = useState<Result>({ kind: "idle" });

  async function handleClick() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setResult({
        kind: "problem",
        message:
          "This browser doesn't support notifications here. They need a supported browser and a secure page (https or localhost).",
      });
      return;
    }

    setResult({ kind: "working" });
    let permission = Notification.permission;
    if (permission === "default") {
      try {
        permission = await Notification.requestPermission();
      } catch {
        permission = Notification.permission;
      }
    }

    if (permission === "denied") {
      setResult({
        kind: "problem",
        message:
          "Notifications are blocked for this site. Allow them in your browser's site settings, then try again.",
      });
      return;
    }
    if (permission !== "granted") {
      setResult({ kind: "problem", message: "Permission wasn't given, so no notification was shown." });
      return;
    }

    try {
      new Notification("Unhook reminder (test)", { body });
      setResult({ kind: "sent" });
    } catch {
      // Some mobile browsers only allow notifications from a service worker.
      setResult({
        kind: "problem",
        message: "This browser only shows notifications from an installed app with a service worker, which Unhook doesn't have yet.",
      });
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={result.kind === "working"}
        className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {result.kind === "working" ? "Waiting for permission…" : "Test notification"}
      </button>
      <p aria-live="polite" className="text-sm">
        {result.kind === "sent" && <span className="text-green-700 dark:text-green-400">Test notification sent.</span>}
        {result.kind === "problem" && <span className="text-red-700 dark:text-red-400">{result.message}</span>}
      </p>
    </div>
  );
}
