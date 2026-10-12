"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// True once the element has scrolled into view (and stays true).
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

// Counts the number inside a label like "+700" or "$3 000" up from 0,
// keeping the prefix/suffix and the original thousands separator.
export function CountUpText({ value, className }: { value: string; className?: string }) {
  const reduced = useReducedMotion();
  const { ref, seen } = useInView<HTMLElement>();
  const m = value.match(/^(\D*)([\d\s.,]+)(.*)$/);
  const target = m ? Number(m[2].replace(/[\s,]/g, "")) : NaN;
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (!seen || reduced || !Number.isFinite(target)) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100);
      setShown(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduced, target]);

  const sep = m?.[2].includes(" ") ? " " : m?.[2].includes(",") ? "," : "";
  const fmt = (n: number) => (sep ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep) : String(n));
  const text = m && shown !== null && !reduced ? `${m[1]}${fmt(shown)}${m[3]}` : value;

  return (
    <b ref={ref} className={className} aria-label={value}>
      {text}
    </b>
  );
}

// Wraps the bar area: bars sit at zero height until visible, then grow.
export function GrowOnView({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const { ref, seen } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`${className ?? ""}${seen || reduced ? " grown" : ""}`}>
      {children}
    </div>
  );
}
