"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Clicking a link marked data-turn turns a "page" over the screen, jumps to the
// section while the page covers it, then turns the page away. Plain smooth scroll
// is used instead when the visitor prefers reduced motion.
//
// The page is a two-sided sheet hinged on an edge, cut into thin vertical strips that are
// chained edge to edge. Each strip bends a little further than the one before it, so the
// sheet curls like paper while it turns instead of staying a flat card. It swings over from
// the right on its right-hand hinge, then tips back off its left-hand hinge, away from the
// reader, and turns off to the left. It darkens as it curls and casts a shadow underneath.

const STRIPS = 16;
// Total curl across the sheet at the middle of a turn, spread evenly over the strips.
const CURL = 75;

type Label = { page: string; title: string };
type Hinge = "left" | "right";

export function PageTurn() {
  const stage = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<Label>({ page: "", title: "" });

  useEffect(() => {
    let busy = false;

    // A refresh starts back at the cover, even if a turn left a #section in the address bar.
    // Opening a shared #section link fresh still lands on that section.
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "reload") {
      history.scrollRestoration = "manual";
      if (location.hash) history.replaceState(null, "", location.pathname + location.search);
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Drives one turn frame by frame: --a is the hinge angle, --b the extra bend per strip,
    // --s how dark the curl is. All three swell and settle with the turn.
    const turn = (sheet: HTMLElement, cast: HTMLElement, from: number, to: number, castFrom: number, castTo: number, duration: number) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const dir = Math.sign(to - from);
        const frame = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          // Slow lift, quick sweep through the middle, soft landing.
          const e = p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
          const swell = Math.sin(Math.PI * p);
          sheet.style.setProperty("--a", `${from + (to - from) * e}deg`);
          sheet.style.setProperty("--b", `${(dir * CURL * swell) / STRIPS}deg`);
          sheet.style.setProperty("--s", `${0.6 * swell}`);
          cast.style.opacity = `${castFrom + (castTo - castFrom) * e}`;
          if (p < 1) requestAnimationFrame(frame);
          else resolve();
        };
        requestAnimationFrame(frame);
      });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[data-turn]");
      if (!link) return;
      const id = link.hash.slice(1);
      const target = id && document.getElementById(id);
      const el = stage.current;
      if (!target || !el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      e.preventDefault();
      if (busy) return;
      busy = true;
      setLabel({ page: link.dataset.page ?? "", title: link.dataset.title ?? "" });

      const cast = el.querySelector<HTMLElement>("[data-cast]")!;
      const sheetIn = el.querySelector<HTMLElement>('[data-sheet="in"]')!;
      const sheetOut = el.querySelector<HTMLElement>('[data-sheet="out"]')!;
      el.style.setProperty("--w", `${el.clientWidth}px`);
      el.hidden = false;

      // Turn in: hinged on the right edge, the sheet swings up from behind the screen and lands flat.
      sheetIn.hidden = false;
      sheetOut.hidden = true;
      turn(sheetIn, cast, -180, 0, 0, 0.3, 750)
        .then(() => {
          const root = document.documentElement;
          const prev = root.style.scrollBehavior;
          root.style.scrollBehavior = "auto";
          target.scrollIntoView({ block: "start" });
          root.style.scrollBehavior = prev;
          history.pushState(null, "", `#${id}`);

          // Swap to the left-hinged sheet. Both lie flat here, so the swap can't be seen.
          sheetOut.style.setProperty("--a", "0deg");
          sheetOut.style.setProperty("--b", "0deg");
          sheetOut.style.setProperty("--s", "0");
          sheetOut.hidden = false;
          sheetIn.hidden = true;
          return new Promise((r) => setTimeout(r, 180));
        })
        // Turn away: hinged on the left edge, the free edge tips back away from you and the sheet curls off to the left.
        .then(() => turn(sheetOut, cast, 0, 180, 0.3, 0, 950))
        .then(() => {
          el.hidden = true;
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          busy = false;
        });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const front = (
    <>
      <p className="font-display text-[clamp(5rem,18vw,12rem)] leading-none font-bold tabular-nums">p.{label.page}</p>
      <p className="mt-4 font-serif text-deck italic">{label.title}</p>
    </>
  );

  return (
    <div ref={stage} aria-hidden="true" hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {/* Shadow the turning sheet casts on the page underneath. */}
      <span data-cast className="absolute inset-0 bg-ink opacity-0" />
      <div data-sheet="in" hidden className="absolute inset-0 [perspective:250vw] [transform-style:preserve-3d]">
        <Strip i={0} hinge="right">{front}</Strip>
      </div>
      <div data-sheet="out" hidden className="absolute inset-0 [perspective:250vw] [transform-style:preserve-3d]">
        <Strip i={0} hinge="left">{front}</Strip>
      </div>
    </div>
  );
}

// One strip of the sheet, with the next strip hanging off its free edge. The first strip turns on
// the hinge (--a); every later one bends a little more relative to its neighbor (--b).
function Strip({ i, hinge, children }: { i: number; hinge: Hinge; children: ReactNode }) {
  const free = hinge === "left" ? "right" : "left";
  // How far this strip's slice sits from the left edge of the page, in strips.
  const slot = hinge === "left" ? i : STRIPS - 1 - i;
  // Darker toward the free edge, where the paper curls most.
  const shade = { opacity: `calc(var(--s, 0) * ${(i + 1) / STRIPS})` };

  return (
    <div
      className="absolute inset-y-0 [transform-style:preserve-3d]"
      style={{
        width: `calc(var(--w) / ${STRIPS})`,
        [hinge]: i === 0 ? 0 : "100%",
        transformOrigin: hinge,
        transform: i === 0 ? "rotateY(var(--a, 0deg))" : "rotateY(var(--b, 0deg))",
      }}
    >
      {/* Front face: this strip's slice of the page. A hair of overlap hides seams between strips. */}
      <div className="absolute inset-y-0 overflow-hidden bg-paper [backface-visibility:hidden]" style={{ [hinge]: 0, [free]: "-1px" }}>
        <div
          className="absolute inset-y-0 flex flex-col items-center justify-center"
          style={{ width: "var(--w)", left: `calc(var(--w) * ${-slot} / ${STRIPS})` }}
        >
          {children}
        </div>
        <span className="absolute inset-0 bg-ink" style={shade} />
      </div>
      {/* Back face, seen once the strip has turned past edge-on. */}
      <div
        className="absolute inset-y-0 bg-paper-2 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        style={{ [hinge]: 0, [free]: "-1px" }}
      >
        <span className="absolute inset-0 bg-ink" style={shade} />
      </div>
      {i < STRIPS - 1 && (
        <Strip i={i + 1} hinge={hinge}>
          {children}
        </Strip>
      )}
    </div>
  );
}
