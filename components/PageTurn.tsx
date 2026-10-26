"use client";

import { useEffect, useRef, useState } from "react";

// Clicking a link marked data-turn flips a "page" across the screen, jumps to the
// section while the page covers it, then turns the page away. Plain smooth scroll
// is used instead when the visitor prefers reduced motion.
export function PageTurn() {
  const sheet = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState({ page: "", title: "" });

  useEffect(() => {
    let busy = false;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[data-turn]");
      if (!link) return;
      const id = link.hash.slice(1);
      const target = id && document.getElementById(id);
      const el = sheet.current;
      if (!target || !el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      e.preventDefault();
      if (busy) return;
      busy = true;
      setLabel({ page: link.dataset.page ?? "", title: link.dataset.title ?? "" });

      // Easy ease (slow start, quick middle, soft landing), matching the site's hover timing.
      // The page sweeps in from the right with a slight 3D lean, then lifts and slides fully off the left edge.
      const ease = "cubic-bezier(0.65, 0, 0.35, 1)";
      const shade = el.querySelector<HTMLElement>("[data-shade]");
      el.hidden = false;
      shade?.animate([{ opacity: 0.4 }, { opacity: 0 }], { duration: 800, easing: ease, fill: "forwards" });
      el.animate(
        [
          { transform: "translateX(115%) rotateY(-38deg)" },
          { transform: "translateX(0) rotateY(0deg)" },
        ],
        { duration: 800, easing: ease, fill: "forwards" },
      ).finished.then(() => {
        const root = document.documentElement;
        const prev = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        target.scrollIntoView({ block: "start" });
        root.style.scrollBehavior = prev;
        history.pushState(null, "", `#${id}`);

        shade?.animate([{ opacity: 0 }, { opacity: 0.4 }], { duration: 850, delay: 200, easing: ease, fill: "forwards" });
        return el.animate(
          [
            { transform: "translateX(0) rotateY(0deg)" },
            { transform: "translateX(-115%) rotateY(38deg)" },
          ],
          { duration: 850, delay: 200, easing: ease, fill: "forwards" },
        ).finished;
      }).then(() => {
        el.hidden = true;
        el.getAnimations({ subtree: true }).forEach((a) => a.cancel());
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        busy = false;
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] [perspective:2200px]">
      <div
        ref={sheet}
        hidden
        className="absolute inset-0 flex origin-center flex-col items-center justify-center bg-paper shadow-[0_0_80px_oklch(0.2_0.02_60/0.35)] will-change-transform [backface-visibility:hidden]"
      >
        {/* Soft shadow across the page as it bends, darkest near the spine. */}
        <span data-shade className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/10 to-transparent opacity-0" />
        <p className="font-display text-[clamp(5rem,18vw,12rem)] leading-none font-bold tabular-nums">p.{label.page}</p>
        <p className="mt-4 font-serif text-deck italic">{label.title}</p>
      </div>
    </div>
  );
}
