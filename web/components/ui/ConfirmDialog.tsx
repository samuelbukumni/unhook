"use client";

// Confirmation dialog (native <dialog>): focus is trapped by the browser,
// Escape cancels, and the backdrop click area is inert. Used before
// destructive actions such as marking a subscription as cancelled.

import { useEffect, useRef } from "react";
import { Button } from "./Button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Go back",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open ]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onCancel}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
      className="m-auto w-[min(24rem,calc(100vw-2rem))] rounded-xl border border-line bg-white p-0 text-navy-900 shadow-xl backdrop:bg-navy-950/50 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-50"
    >
      <div className="flex flex-col gap-3 p-5">
        <h2 id="confirm-dialog-title" className="text-lg font-medium">
          {title}
        </h2>
        <p id="confirm-dialog-desc" className="text-sm text-navy-600 dark:text-navy-100">{description}</p>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
