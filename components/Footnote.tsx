"use client";

import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

// A small numbered marker that shows a note on hover (mouse), focus (keyboard) or tap (phone),
// like a magazine margin note. The note is placed with fixed positioning so it never runs off-screen.
export function Footnote({ n, children }: { n: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();

  useLayoutEffect(() => {
    if (!open || !btn.current) return;
    const place = () => {
      const r = btn.current!.getBoundingClientRect();
      const width = Math.min(272, window.innerWidth - 32);
      const left = Math.min(Math.max(16, r.left + r.width / 2 - width / 2), window.innerWidth - width - 16);
      setPos({ left, top: r.top });
    };
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  return (
    <span className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        ref={btn}
        type="button"
        aria-describedby={open ? id : undefined}
        aria-label={`Footnote ${n}`}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        // Tapping focuses the button (opening the note); tapping anywhere else blurs it and closes the note.
        onClick={() => setOpen(true)}
        className="relative -top-[0.55em] ml-0.5 inline-flex size-[1.15rem] items-center justify-center rounded-full bg-ink font-sans text-[0.625rem] leading-none font-bold text-paper transition-colors duration-500 ease-easy hover:bg-marker hover:text-on-marker"
      >
        {n}
      </button>
      {open && pos && (
        <span
          id={id}
          role="tooltip"
          className="anim-note fixed z-[55] block w-[min(17rem,calc(100vw-2rem))] -translate-y-[calc(100%+10px)] rounded-md border border-ink bg-paper px-3.5 py-2.5 font-sans text-sm leading-snug font-medium text-ink shadow-[0_14px_30px_-14px_oklch(0.2_0.02_60/0.5)]"
          style={{ left: pos.left, top: pos.top }}
        >
          <span className="mr-1.5 font-bold">{n}.</span>
          {children}
        </span>
      )}
    </span>
  );
}
