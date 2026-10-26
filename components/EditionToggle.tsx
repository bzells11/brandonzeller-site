"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const isNight = () => document.documentElement.dataset.theme === "night";

// Switches between the day edition (paper) and the night edition (black).
// The choice is remembered in this browser; the inline script in layout.tsx applies it before first paint.
export function EditionToggle() {
  const night = useSyncExternalStore(subscribe, isNight, () => false);

  const toggle = () => {
    const root = document.documentElement;
    if (night) delete root.dataset.theme;
    else root.dataset.theme = "night";
    try {
      localStorage.setItem("edition", night ? "day" : "night");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={night}
      title={night ? "Switch to the day edition" : "Switch to the night edition"}
      className="flex h-9 items-center gap-2 rounded-md px-1.5 font-sans text-sm font-medium transition-colors duration-500 ease-easy hover:bg-marker"
    >
      <span className="sr-only">Night edition</span>
      <svg viewBox="0 0 20 20" aria-hidden="true" className="size-[1.125rem]">
        {night ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="10" cy="10" r="3.6" />
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4" />
          </g>
        ) : (
          <path d="M16.5 12.4A6.8 6.8 0 0 1 7.6 3.5a6.8 6.8 0 1 0 8.9 8.9Z" fill="currentColor" />
        )}
      </svg>
      <span aria-hidden="true" className="hidden lg:inline">{night ? "Day" : "Night"}</span>
    </button>
  );
}
