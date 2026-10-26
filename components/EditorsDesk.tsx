"use client";

import { useEffect, useRef, useState } from "react";

// The secret: ↑ ↑ ↓ ↓ ← → ← → B A Enter opens the "Editor's desk",
// which links to the site's private visitor analytics on Vercel (login required).
const CODE = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a", "enter"];
const ANALYTICS_URL = "https://vercel.com/bzells11s-projects/brandonzeller-site/analytics";

export function EditorsDesk() {
  const [open, setOpen] = useState(false);
  const progress = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.closest("input, textarea, [contenteditable]")) return;
      const key = e.key.toLowerCase();
      // Holding Shift (or Caps Lock, etc.) to type a capital letter shouldn't reset the code.
      if (e.repeat || ["shift", "capslock", "control", "alt", "meta"].includes(key)) return;

      if (open && key === "escape") return setOpen(false);

      if (key === CODE[progress.current]) {
        progress.current += 1;
        if (progress.current === CODE.length) {
          progress.current = 0;
          setOpen(true);
        }
      } else {
        progress.current = key === CODE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    // Focus the panel, not a button: the Enter that opened it would otherwise "click" that button.
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="desk-title"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 p-4"
      onClick={() => setOpen(false)}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="anim-desk outline-none w-full max-w-md rounded-lg border border-ink bg-paper p-6 shadow-[0_30px_60px_-20px_oklch(0.2_0.02_60/0.6)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-sans text-kicker font-semibold uppercase text-muted">Staff only · No. 01</p>
        <h2 id="desk-title" className="mt-3 text-h2 italic">
          The editor&rsquo;s desk.
        </h2>
        <p className="mt-4 text-body">
          You found the back room. Here&rsquo;s who has been reading this issue.
        </p>
        <div className="mt-7 grid gap-3">
          <a
            href={ANALYTICS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center rounded-md border border-ink bg-ink font-sans text-sm font-semibold text-paper transition duration-500 ease-easy hover:bg-marker hover:text-ink"
          >
            Open visitor analytics
          </a>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-12 items-center justify-center rounded-md border border-ink font-sans text-sm font-semibold transition duration-500 ease-easy hover:bg-marker"
          >
            Back to the issue
          </button>
        </div>
        <p className="mt-5 font-sans text-xs text-muted">Analytics open in Vercel and need the site owner&rsquo;s login.</p>
      </div>
    </div>
  );
}
