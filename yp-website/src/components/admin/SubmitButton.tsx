"use client";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel,
  className = "apply-btn",
  style,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      style={{ ["--accent" as string]: "var(--blue)", ...style }}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
