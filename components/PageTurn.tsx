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
const CURL = 90;

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

    // Plays one turn. Every strip's whole path is worked out up front as keyframes and handed to
    // the browser, which runs transform and opacity animations off the main thread, so the turn stays
    // smooth even while the page underneath is busy scrolling and revealing. Each keyframe turns the
    // sheet on its hinge, then bends every strip a little more than the one before it.
    const turn = (sheet: HTMLElement, cast: HTMLElement, w: number, from: number, to: number, castFrom: number, castTo: number, duration: number, delay = 0) => {
      const step = ((sheet.dataset.sheet === "out" ? 1 : -1) * w) / STRIPS;
      const dir = Math.sign(to - from);
      const steps = Array.from({ length: 61 }, (_, k) => {
        const p = k / 60;
        // Slow lift, quick sweep through the middle, soft landing.
        const e = p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
        // sin² rather than sin: the curl starts and settles at zero speed, in step with the hinge.
        const swell = Math.sin(Math.PI * p) ** 2;
        return { a: from + (to - from) * e, b: (dir * CURL * swell) / STRIPS, swell, e };
      });
      const timing = { duration, delay, easing: "linear", fill: "both" } as const;

      const runs = [...sheet.querySelectorAll<HTMLElement>("[data-strip]")].map((strip, i) =>
        strip.animate(
          steps.map(({ a, b }) => ({ transform: `rotateY(${a}deg)` + ` translateX(${step}px) rotateY(${b}deg)`.repeat(i) })),
          timing,
        ),
      );
      sheet.querySelectorAll<HTMLElement>("[data-shade]").forEach((shade) => shade.animate(steps.map(({ swell }) => ({ opacity: 0.45 * swell })), timing));
      cast.animate(steps.map(({ e }) => ({ opacity: castFrom + (castTo - castFrom) * e })), timing);
      return Promise.all(runs.map((r) => r.finished));
    };

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
      // Unhide before measuring: a hidden stage is 0px wide, which would collapse every strip.
      el.hidden = false;
      const w = el.clientWidth;
      el.style.setProperty("--w", `${w}px`);

      // Turn in: hinged on the right edge, the sheet swings up from behind the screen and lands flat.
      sheetIn.hidden = false;
      sheetOut.hidden = true;
      turn(sheetIn, cast, w, -180, 0, 0, 0.3, 750)
        .then(() => {
          const root = document.documentElement;
          const prev = root.style.scrollBehavior;
          root.style.scrollBehavior = "auto";
          target.scrollIntoView({ block: "start" });
          root.style.scrollBehavior = prev;
          history.pushState(null, "", `#${id}`);

          // Swap to the left-hinged sheet. Both lie flat here, so the swap can't be seen. The short
          // delay lets the page land and rest before it turns away.
          sheetOut.hidden = false;
          sheetIn.hidden = true;
          // Turn away: hinged on the left edge, the free edge tips back away from you and the sheet curls off to the left.
          return turn(sheetOut, cast, w, 0, 180, 0.3, 0, 950, 180);
        })
        .then(() => {
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
      <div data-sheet="in" hidden className="absolute inset-0 [perspective:350vw] [transform-style:preserve-3d]">
        {Array.from({ length: STRIPS }, (_, i) => (
          <Strip key={i} i={i} hinge="right">
            {front}
          </Strip>
        ))}
      </div>
      <div data-sheet="out" hidden className="absolute inset-0 [perspective:350vw] [transform-style:preserve-3d]">
        {Array.from({ length: STRIPS }, (_, i) => (
          <Strip key={i} i={i} hinge="left">
            {front}
          </Strip>
        ))}
      </div>
    </div>
  );
}

// One strip of the sheet. Every strip sits at the hinge and is carried out to its place by
// translateX at rest, or by the turn's keyframes while it moves. The strips are siblings rather
// than nested, because Chrome draws a bright seam through deeply nested 3D layers.
function Strip({ i, hinge, children }: { i: number; hinge: Hinge; children: ReactNode }) {
  const free = hinge === "left" ? "right" : "left";
  // How far this strip's slice sits from the left edge of the page, in strips.
  const slot = hinge === "left" ? i : STRIPS - 1 - i;
  // Darker toward the free edge, where the paper curls most. Each strip fades from its neighbor's
  // shade to its own, so the sheet shades smoothly instead of in bands. The turn fades it in and out.
  const tone = (n: number) => `oklch(0.2 0.02 60 / ${n / STRIPS})`;
  const shade = { backgroundImage: `linear-gradient(to ${free}, ${tone(i)}, ${tone(i + 1)})` };

  return (
    <div
      data-strip
      className="absolute inset-y-0 [transform-style:preserve-3d]"
      style={{
        width: `calc(var(--w) / ${STRIPS})`,
        [hinge]: 0,
        transformOrigin: hinge,
        transform: `translateX(calc(var(--w) * ${(hinge === "left" ? i : -i) / STRIPS}))`,
      }}
    >
      {/* Front face: this strip's slice of the page. A sliver of overlap hides seams between strips. */}
      <div className="absolute inset-y-0 overflow-hidden bg-paper [backface-visibility:hidden]" style={{ [hinge]: 0, [free]: "-2px" }}>
        <div
          className="absolute inset-y-0 flex flex-col items-center justify-center"
          style={{ width: "var(--w)", left: `calc(var(--w) * ${-slot} / ${STRIPS})` }}
        >
          {children}
        </div>
        <span data-shade className="absolute inset-0 opacity-0" style={shade} />
      </div>
      {/* Back face, seen once the strip has turned past edge-on. */}
      <div
        className="absolute inset-y-0 bg-paper-2 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        style={{ [hinge]: 0, [free]: "-2px" }}
      >
        <span data-shade className="absolute inset-0 opacity-0" style={shade} />
      </div>
    </div>
  );
}
