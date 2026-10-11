"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SplitHeadline({ plain, shiny }: { plain: string; shiny: string }) {
  const reduced = useReducedMotion();
  const [showShine, setShowShine] = useState(false);
  const emRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) return;
    const em = emRef.current;
    if (!em) return;
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName !== "wordPop") return;
      setShowShine(true);
    };
    em.addEventListener("animationend", onEnd);
    return () => em.removeEventListener("animationend", onEnd);
  }, [reduced]);

  const chars = [...plain];

  return (
    <h1>
      <span aria-label={plain}>
        {chars.map((ch, i) => (
          <span
            key={i}
            className={reduced ? undefined : "char"}
            style={reduced ? undefined : { animationDelay: `${i * 32}ms` }}
            aria-hidden="true"
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>{" "}
      <em
        ref={emRef}
        className={reduced ? undefined : `pop${showShine ? " shine" : ""}`}
        style={
          reduced
            ? { opacity: 1, transform: "none" }
            : { animationDelay: `${chars.length * 32 + 150}ms` }
        }
      >
        {shiny}
      </em>
    </h1>
  );
}
