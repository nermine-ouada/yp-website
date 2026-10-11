"use client";
import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "./icons";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EXAMPLES = ["power", "phd", "women", "robotics", "photonics", "policy"];

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const reduced = useReducedMotion();
  const [placeholder, setPlaceholder] = useState("SEARCH: power / phd / women / robotics…");
  const inputRef = useRef<HTMLInputElement>(null);
  const focusedRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    let exIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (focusedRef.current || inputRef.current?.value) {
        timer = setTimeout(tick, 400);
        return;
      }
      const word = EXAMPLES[exIndex];
      const base = "SEARCH: ";
      if (!deleting) {
        charIndex++;
        setPlaceholder(base + word.slice(0, charIndex) + "▌");
        if (charIndex === word.length) {
          deleting = true;
          timer = setTimeout(tick, 900);
          return;
        }
      } else {
        charIndex--;
        setPlaceholder(base + word.slice(0, charIndex) + "▌");
        if (charIndex === 0) {
          deleting = false;
          exIndex = (exIndex + 1) % EXAMPLES.length;
        }
      }
      timer = setTimeout(tick, deleting ? 40 : 75);
    };
    tick();
    return () => clearTimeout(timer);
  }, [reduced]);

  return (
    <label className="search-tape" htmlFor="searchInput">
      <SearchIcon />
      <input
        id="searchInput"
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        value={value}
        onFocus={() => (focusedRef.current = true)}
        onBlur={() => (focusedRef.current = false)}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
