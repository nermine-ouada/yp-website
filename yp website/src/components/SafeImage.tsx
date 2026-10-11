"use client";
import { useEffect, useRef, useState } from "react";

// Local copies of the yp.ieee.tn photos live in public/yp/. Until a file is
// there, show a paper placeholder instead of a broken-image icon.
export function SafeImage({
  src,
  alt,
  label,
  className,
}: {
  src: string;
  alt: string;
  label?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // The image can finish failing before hydration attaches onError.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div className={`img-fallback ${className ?? ""}`} role="img" aria-label={alt}>
        <span>{label ?? alt}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />
  );
}
