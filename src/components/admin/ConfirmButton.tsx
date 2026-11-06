"use client";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

function ConfirmDialog({
  message,
  danger,
  onCancel,
  onConfirm,
}: {
  message: string;
  danger: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="confirm-backdrop" onClick={onCancel}>
      <div
        className="confirm-card"
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirm action"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="confirm-title">Are you sure?</p>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button type="button" className="admin-link-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`admin-link-btn${danger ? " danger" : ""}`}
            onClick={onConfirm}
            autoFocus
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmButton({
  children,
  className,
  confirmMessage,
}: {
  children: React.ReactNode;
  className?: string;
  confirmMessage: string;
}) {
  const { pending } = useFormStatus();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={className}
        disabled={pending}
        onClick={() => setOpen(true)}
      >
        {pending ? "Working…" : children}
      </button>
      {open && (
        <ConfirmDialog
          message={confirmMessage}
          danger={Boolean(className?.includes("danger"))}
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            setOpen(false);
            btnRef.current?.form?.requestSubmit();
          }}
        />
      )}
    </>
  );
}
