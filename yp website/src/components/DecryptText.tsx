"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const STEPS = 10;

export function DecryptText({
  text,
  delay = 0,
  duration = 550,
  as: Tag = "span",
  className,
}: {
  text: string;
  delay?: number;
  duration?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    // `reduced` can flip true on the very next tick, after the accessibility
    // media query check resolves — always force the real text in that case,
    // even if a scramble already kicked off, so it can never get stuck mid-way.
    if (reduced) {
      setDisplay(text);
      return;
    }
    if (started.current) return;
    started.current = true;

    // Independently-scheduled timeouts (not a self-chaining rAF loop) so a
    // single delayed/dropped frame can't stall the whole sequence — the last
    // step always lands on the exact final text no matter what.
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let s = 1; s <= STEPS; s++) {
      timers.push(
        setTimeout(() => {
          if (s === STEPS) {
            setDisplay(text);
            return;
          }
          const locked = Math.floor((s / STEPS) * text.length);
          let out = "";
          for (let i = 0; i < text.length; i++) {
            out +=
              text[i] === " "
                ? " "
                : i < locked
                ? text[i]
                : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
          setDisplay(out);
        }, delay + (s * duration) / STEPS)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [reduced, text, delay, duration]);

  return <Tag className={className}>{display}</Tag>;
}
