"use client";

import { useEffect, useRef, useState } from "react";

// The secret: ↑ ↑ ↓ ↓ ← → ← → B A Enter (the Konami code) toggles the "print edition":
// the whole site turns into an aged, black-and-white newspaper. Typing it again switches back.
// The look lives in globals.css under [data-edition="print"].
const CODE = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a", "enter"];

export function EditorsDesk() {
  const [toast, setToast] = useState<"on" | "off" | null>(null);
  const progress = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.closest("input, textarea, [contenteditable]")) return;
      const key = e.key.toLowerCase();
      // Holding Shift (or Caps Lock, etc.) to type a capital letter shouldn't reset the code.
      if (e.repeat || ["shift", "capslock", "control", "alt", "meta"].includes(key)) return;

      if (key !== CODE[progress.current]) {
        progress.current = key === CODE[0] ? 1 : 0;
        return;
      }
      progress.current += 1;
      if (progress.current < CODE.length) return;

      progress.current = 0;
      const root = document.documentElement;
      const on = root.dataset.edition !== "print";
      if (on) root.dataset.edition = "print";
      else delete root.dataset.edition;

      clearTimeout(timer.current);
      setToast(on ? "on" : "off");
      timer.current = setTimeout(() => setToast(null), 3800);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer.current);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      role="status"
      key={toast}
      className="anim-stamp-in fixed bottom-6 left-1/2 z-[70] w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 rotate-[-1.5deg] border-2 border-ink bg-paper px-5 py-4 text-center shadow-[0_18px_40px_-18px_oklch(0.2_0.02_60/0.6)]"
    >
      <p className="font-sans text-kicker font-semibold uppercase text-muted">
        {toast === "on" ? "Extra! Extra!" : "Back to the regular issue"}
      </p>
      <p className="mt-1 font-display text-2xl font-bold italic">
        {toast === "on" ? "You found the print edition." : "Print edition off."}
      </p>
      <p className="mt-1 font-sans text-xs text-muted">
        {toast === "on" ? "Type the code again to switch back." : "Type the code again any time."}
      </p>
    </div>
  );
}
