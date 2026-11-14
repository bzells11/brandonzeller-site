"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Tilts the cover a few degrees toward the cursor, like picking a magazine up off a table.
// Desktop mice only, skipped for reduced motion, and batched to one update per frame.
export function CoverTilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    // The lean is set on the tilting element itself (not this wrapper), so a mouse move restyles one
    // element instead of everything on the cover.
    const tilt = el?.querySelector<HTMLElement>(".cover-tilt");
    if (!el || !tilt) return;
    if (!matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
        tilt.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      tilt.style.setProperty("--ry", "0deg");
      tilt.style.setProperty("--rx", "0deg");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`cover-3d ${className}`}>
      {children}
    </div>
  );
}
