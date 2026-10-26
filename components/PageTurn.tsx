"use client";

import { useEffect, useRef, useState } from "react";

// Clicking a link marked data-turn turns a "page" over the screen, jumps to the
// section while the page covers it, then turns the page away. Plain smooth scroll
// is used instead when the visitor prefers reduced motion.
//
// The page is a real two-sided sheet hinged on an edge, so it flips in 3D rather than sliding:
// it swings over from the right on its right-hand hinge, then tips back off its left-hand hinge,
// away from the reader, and turns off to the left. It darkens as it bends and casts a shadow on the
// page underneath.
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

      const stage = el.parentElement!;
      const cast = stage.querySelector<HTMLElement>("[data-cast]")!;
      const shade = el.querySelector<HTMLElement>("[data-shade]")!;
      // Slow lift, quick sweep through the middle, soft landing.
      const ease = "cubic-bezier(0.5, 0, 0.2, 1)";
      const shadow = (side: "left" | "right") =>
        `linear-gradient(to ${side}, oklch(0.2 0.02 60 / 0.55), oklch(0.2 0.02 60 / 0.12) 35%, transparent 70%)`;

      // Turn in: hinged on the right edge, the sheet swings up from behind the screen and lands flat.
      stage.hidden = false;
      el.style.transformOrigin = "right center";
      shade.style.backgroundImage = shadow("left");
      cast.animate([{ opacity: 0 }, { opacity: 0.35, offset: 0.7 }, { opacity: 0.2 }], { duration: 750, easing: ease, fill: "forwards" });
      shade.animate([{ opacity: 0.7 }, { opacity: 0 }], { duration: 750, easing: ease, fill: "forwards" });
      el.animate(
        [
          { transform: "rotateY(-180deg)" },
          { transform: "rotateY(0deg)" },
        ],
        { duration: 750, easing: ease, fill: "forwards" },
      ).finished.then(() => {
        const root = document.documentElement;
        const prev = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        target.scrollIntoView({ block: "start" });
        root.style.scrollBehavior = prev;
        history.pushState(null, "", `#${id}`);

        // Turn away: hinged on the left edge, the free edge tips back away from you and the sheet flips off to the left.
        el.style.transformOrigin = "left center";
        shade.style.backgroundImage = shadow("right");
        const out = { duration: 900, delay: 180, easing: ease, fill: "forwards" } as const;
        cast.animate([{ opacity: 0.35 }, { opacity: 0 }], out);
        shade.animate([{ opacity: 0 }, { opacity: 0.7 }], out);
        return el.animate(
          [
            { transform: "rotateY(0deg)" },
            { transform: "rotateY(180deg)" },
          ],
          out,
        ).finished;
      }).then(() => {
        stage.hidden = true;
        stage.getAnimations({ subtree: true }).forEach((a) => a.cancel());
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        busy = false;
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div aria-hidden="true" hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden [perspective:250vw]">
      {/* Shadow the turning sheet casts on the page underneath. */}
      <span data-cast className="absolute inset-0 bg-ink opacity-0" />
      <div ref={sheet} className="absolute inset-0 will-change-transform [transform-style:preserve-3d]">
        {/* Front of the page: the section it's turning to. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-paper [backface-visibility:hidden]">
          <span data-shade className="absolute inset-0 opacity-0" />
          <p className="relative font-display text-[clamp(5rem,18vw,12rem)] leading-none font-bold tabular-nums">p.{label.page}</p>
          <p className="relative mt-4 font-serif text-deck italic">{label.title}</p>
        </div>
        {/* Back of the page, seen while it's past halfway through the turn. */}
        <div className="absolute inset-0 bg-paper-2 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="absolute inset-0 bg-gradient-to-r from-ink/25 via-transparent to-ink/10" />
        </div>
      </div>
    </div>
  );
}
