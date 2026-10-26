"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/content/site";

// The secret: ↑ ↑ ↓ ↓ ← → ← → B A Enter (the Konami code) opens "p.00",
// the page that never went to print: a confetti burst of paper scraps and a press pass.
const CODE = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a", "enter"];
const SCRAPS = 70;

export function EditorsDesk() {
  const [open, setOpen] = useState(false);
  const [pass, setPass] = useState("0000");
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
          setPass(String(Math.floor(1000 + Math.random() * 9000)));
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
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-black/60 p-4"
      onClick={() => setOpen(false)}
    >
      <Confetti />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="anim-desk relative w-full max-w-md overflow-hidden rounded-lg border border-ink bg-paper outline-none shadow-[0_30px_60px_-20px_oklch(0.2_0.02_60/0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lanyard strip */}
        <div className="flex items-center justify-between bg-ink px-6 py-3 font-sans text-kicker font-semibold uppercase text-paper">
          <span>Press pass</span>
          <span className="rounded-[3px] bg-marker px-1.5 text-on-marker">All access</span>
        </div>

        <div className="p-6 sm:p-8">
          <p className="font-sans text-kicker font-semibold uppercase text-muted">p.00 · The page that never went to print</p>
          <h2 id="desk-title" className="mt-3 text-h2 italic">
            You found it.
          </h2>
          <p className="mt-4 text-body">
            Welcome to the back room. You typed the Konami code, a cheat code from 1986, which makes you officially
            curious. I like that.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-5 border-t-[3px] border-ink font-sans text-sm">
            <div className="border-b border-rule py-2.5">
              <dt className="text-kicker font-semibold uppercase text-muted">Holder</dt>
              <dd className="mt-0.5 font-semibold">A curious reader</dd>
            </div>
            <div className="border-b border-rule py-2.5">
              <dt className="text-kicker font-semibold uppercase text-muted">Pass no.</dt>
              <dd className="mt-0.5 font-semibold tabular-nums">#{pass}</dd>
            </div>
            <div className="col-span-2 border-b border-rule py-2.5">
              <dt className="text-kicker font-semibold uppercase text-muted">Behind the scenes</dt>
              <dd className="mt-0.5">Designed and built by me with Claude Code, then redesigned more times than I&rsquo;d like to admit.</dd>
            </div>
          </dl>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("I found p.00")}`}
              className="flex h-12 items-center justify-center rounded-md border border-ink bg-ink font-sans text-sm font-semibold text-paper transition duration-500 ease-easy hover:bg-marker hover:text-on-marker"
            >
              Tell me you found it
            </a>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-12 items-center justify-center rounded-md border border-ink font-sans text-sm font-semibold transition duration-500 ease-easy hover:bg-marker hover:text-on-marker"
            >
              Back to the issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Paper scraps and highlighter bits that burst up and flutter down. Pure CSS animation.
function Confetti() {
  const colors = ["var(--color-marker)", "var(--color-paper)", "var(--color-ink)", "var(--color-cover)"];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {Array.from({ length: SCRAPS }, (_, i) => {
        const left = (i * 37) % 100;
        const drift = ((i * 53) % 40) - 20;
        const spin = ((i * 71) % 720) - 360;
        return (
          <span
            key={i}
            className="anim-scrap absolute top-[-4vh] block"
            style={
              {
                left: `${left}%`,
                width: `${6 + (i % 4) * 3}px`,
                height: `${10 + (i % 3) * 5}px`,
                background: colors[i % colors.length],
                animationDelay: `${(i % 14) * 45}ms`,
                animationDuration: `${1600 + (i % 7) * 220}ms`,
                "--drift": `${drift}vw`,
                "--spin": `${spin}deg`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
