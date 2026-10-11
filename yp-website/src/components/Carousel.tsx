"use client";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Slides in a row, `perView` visible at a time (1 on phones, `tablet` from
// 640px, `perView` from 980px). Arrows, dots, swipe, and optional autoplay that
// pauses on hover/focus and is off under prefers-reduced-motion.
export function Carousel({
  children,
  perView = 1,
  tablet,
  autoplay = 0,
  label,
}: {
  children: React.ReactNode;
  perView?: number;
  tablet?: number;
  autoplay?: number;
  label: string;
}) {
  const slides = Children.toArray(children);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(1);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const lg = window.matchMedia("(min-width: 980px)");
    const md = window.matchMedia("(min-width: 640px)");
    const update = () => setVisible(lg.matches ? perView : md.matches ? (tablet ?? Math.min(2, perView)) : 1);
    update();
    lg.addEventListener("change", update);
    md.addEventListener("change", update);
    return () => {
      lg.removeEventListener("change", update);
      md.removeEventListener("change", update);
    };
  }, [perView, tablet]);

  const last = Math.max(0, slides.length - visible);
  const current = Math.min(index, last);
  const go = useCallback((i: number) => setIndex(i < 0 ? last : i > last ? 0 : i), [last]);

  useEffect(() => {
    if (!autoplay || reduced || paused || last === 0) return;
    const t = setTimeout(() => go(current + 1), autoplay);
    return () => clearTimeout(t);
  }, [autoplay, reduced, paused, current, last, go]);

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="carousel-viewport"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${(current * 100) / visible}%)`, transition: reduced ? "none" : undefined }}
        >
          {slides.map((slide, i) => (
            <div
              className="carousel-slide"
              key={i}
              style={{ flexBasis: `${100 / visible}%` }}
              inert={i < current || i >= current + visible}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {last > 0 && (
        <div className="carousel-controls">
          <button type="button" className="carousel-arrow" onClick={() => go(current - 1)} aria-label="Previous">
            ←
          </button>
          <div className="carousel-dots">
            {Array.from({ length: last + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`carousel-dot${i === current ? " active" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button type="button" className="carousel-arrow" onClick={() => go(current + 1)} aria-label="Next">
            →
          </button>
        </div>
      )}
    </div>
  );
}
