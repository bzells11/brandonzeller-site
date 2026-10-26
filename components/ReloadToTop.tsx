"use client";

import { useEffect } from "react";

// A refresh starts back at the cover, even if a contents link left a #section in the address bar.
// Opening a shared #section link fresh still lands on that section.
export function ReloadToTop() {
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type !== "reload") return;
    history.scrollRestoration = "manual";
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return null;
}
