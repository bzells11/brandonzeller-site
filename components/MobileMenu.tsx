"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { contents } from "./contents";

const entries = Object.values(contents);

// Phone-only menu: opens a full-screen contents page under the nav.
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-2 px-1 font-sans text-sm font-semibold"
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true" className="relative block h-2.5 w-4">
          <span className={`absolute left-0 h-0.5 w-4 bg-ink transition-transform duration-300 ${open ? "top-1 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 h-0.5 w-4 bg-ink transition-transform duration-300 ${open ? "top-1 -rotate-45" : "top-2"}`} />
        </span>
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className={`paper fixed inset-x-0 top-12 bottom-0 z-40 flex-col overflow-y-auto bg-paper px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] ${open ? "flex" : ""}`}
      >
        <p className="font-display text-[length:clamp(1.5rem,5dvh,2.5rem)] leading-none italic">Contents</p>
        {/* Rows share whatever height is left, so the whole list and the buttons fit without scrolling. */}
        <ol className="mt-3 flex flex-1 flex-col border-t-[3px] border-ink">
          {entries.map((e, i) => (
            <li key={e.id} className="anim-rise flex max-h-24 flex-1 border-b border-rule" style={{ animationDelay: `${i * 50}ms` }}>
              <a
                href={`#${e.id}`}
                onClick={() => setOpen(false)}
                className="grid flex-1 grid-cols-[3.25rem_1fr] content-center items-baseline gap-2 py-1"
              >
                <span className="font-display text-[length:clamp(1.25rem,3.6dvh,1.875rem)] leading-none font-bold tabular-nums">{e.page}</span>
                <span>
                  <span className="block font-sans text-kicker font-semibold uppercase text-muted">{e.label}</span>
                  <span className="block font-serif text-[length:clamp(1rem,3dvh,1.5rem)] leading-tight italic">{e.title}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
        <div className="mt-3 grid shrink-0 grid-cols-2 gap-3 font-sans text-sm font-semibold">
          <a href={`mailto:${site.email}`} className="flex h-11 items-center justify-center rounded-md border border-ink">
            Email
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center rounded-md border border-ink"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </>
  );
}
