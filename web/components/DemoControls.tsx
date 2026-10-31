"use client";

// Small demo-mode controls for the footer, handy when recording a video.
// "Load demo data" replaces everything with the 8 mock subscriptions;
// "Reset" deletes all saved subscriptions. Both ask first, because they
// overwrite what's saved. Every page updates through the storage listeners.

import { useState } from "react";
import { clearAllData, loadDemoData } from "@/lib/storage";

const buttonClass =
  "rounded-md px-2 py-1 underline-offset-2 hover:underline";

export function DemoControls() {
  const [message, setMessage] = useState("");

  function handleLoad() {
    if (!window.confirm("Replace all saved subscriptions with the 8 demo subscriptions?")) return;
    loadDemoData();
    setMessage("Demo data loaded.");
  }

  function handleReset() {
    if (!window.confirm("Delete all saved subscriptions? This can't be undone.")) return;
    clearAllData();
    setMessage("All data cleared.");
  }

  return (
    <div role="group" aria-label="Demo data" className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
      <span>Demo:</span>
      <button type="button" onClick={handleLoad} className={buttonClass}>
        Load demo data
      </button>
      <button type="button" onClick={handleReset} className={`${buttonClass} text-red-700 dark:text-red-400`}>
        Reset
      </button>
      <span aria-live="polite">{message}</span>
    </div>
  );
}
