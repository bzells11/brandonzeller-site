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
        className="fixed inset-x-0 top-12 bottom-0 z-40 overflow-y-auto bg-paper px-4 pt-6 pb-10"
      >
        <p className="font-display text-5xl italic">Contents</p>
        <ol className="mt-6 border-t-[3px] border-ink">
          {entries.map((e, i) => (
            <li key={e.id} className="anim-rise border-b border-rule" style={{ animationDelay: `${i * 50}ms` }}>
              <a
                href={`#${e.id}`}
                onClick={() => setOpen(false)}
                className="grid grid-cols-[3.25rem_1fr] items-baseline gap-2 py-4 active:bg-marker"
              >
                <span className="font-display text-3xl font-bold tabular-nums">{e.page}</span>
                <span>
                  <span className="block font-sans text-kicker font-semibold uppercase text-muted">{e.label}</span>
                  <span className="mt-0.5 block font-serif text-2xl italic">{e.title}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid grid-cols-2 gap-3 font-sans text-sm font-semibold">
          <a href={`mailto:${site.email}`} className="flex h-12 items-center justify-center rounded-md border border-ink active:bg-marker">
            Email
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center rounded-md border border-ink active:bg-marker"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </>
  );
}
