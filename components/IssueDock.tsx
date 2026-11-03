"use client";

import { useEffect } from "react";

// The issue covers on the "Every issue" shelf float in a small row at the bottom middle of the screen
// while you read, and you can click them from anywhere. As the shelf scrolls into view they fly back
// into their slots, which sit empty until then. It moves the shelf covers themselves (anything marked
// data-dock), so there's only one copy of each. Desktop only for now; on smaller screens the shelf is
// left as it is.
const SCALE = 0.36; // docked size, relative to the cover on the shelf
const GAP = 14; // space between docked covers, px
const BOTTOM = 22; // docked row's distance from the bottom of the screen, px

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function IssueDock() {
  useEffect(() => {
    const wide = matchMedia("(min-width: 1024px)");
    const covers = [...document.querySelectorAll<HTMLElement>("[data-dock]")];
    if (!covers.length) return;

    // Where each cover sits on the shelf, in page coordinates, measured with no transform applied.
    let slots: { x: number; y: number; w: number; h: number }[] = [];
    let vw = 0;
    let vh = 0;
    let frame = 0;
    let active = false;

    const measure = () => {
      covers.forEach((c) => (c.style.transform = ""));
      vw = document.documentElement.clientWidth;
      vh = innerHeight;
      slots = covers.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
      });
    };

    const update = () => {
      frame = 0;
      const y = scrollY;
      // 0 = floating in the dock, 1 = back on the shelf. The flight starts as the shelf comes up from the
      // bottom of the screen and ends when it's a bit above the middle.
      const shelfTop = slots[0].y - y;
      const e = ease(Math.min(1, Math.max(0, (vh - shelfTop) / (vh * 0.55))));
      const total = slots.reduce((s, r) => s + r.w * SCALE, 0) + GAP * (slots.length - 1);
      let dockX = vw / 2 - total / 2;

      covers.forEach((c, i) => {
        const s = slots[i];
        const dockY = vh - BOTTOM - s.h * SCALE;
        const dx = dockX - s.x;
        const dy = dockY - (s.y - y);
        dockX += s.w * SCALE + GAP;
        const k = 1 - e;
        c.style.transform = e === 1 ? "" : `translate3d(${(dx * k).toFixed(1)}px, ${(dy * k).toFixed(1)}px, 0) scale(${(SCALE + (1 - SCALE) * e).toFixed(4)})`;
        c.style.setProperty("--dock", k.toFixed(3));
        c.toggleAttribute("data-docked", e < 1);
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      update();
    };

    const start = () => {
      if (active) return;
      active = true;
      measure();
      update();
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onResize);
    };
    const stop = () => {
      if (!active) return;
      active = false;
      cancelAnimationFrame(frame);
      frame = 0;
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      covers.forEach((c) => {
        c.style.transform = "";
        c.style.removeProperty("--dock");
        c.removeAttribute("data-docked");
      });
    };
    const sync = () => (wide.matches ? start() : stop());

    sync();
    wide.addEventListener("change", sync);
    // Fonts, images and anything else that changes the page's height move the shelf, so measure again.
    const pageSize = new ResizeObserver(() => active && onResize());
    pageSize.observe(document.body);
    return () => {
      stop();
      pageSize.disconnect();
      wide.removeEventListener("change", sync);
    };
  }, []);

  return null;
}
