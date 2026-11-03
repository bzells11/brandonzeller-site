"use client";

import { useEffect } from "react";

// The issue covers on the "Every issue" shelf sit in a small row at the bottom middle of the screen
// while you read, and you can click them from anywhere. As the shelf scrolls into view they fly back
// into their slots, which sit empty until then. Desktop only for now; on smaller screens the shelf is
// left as it is.
//
// While docked, what you see is a copy of each cover in a fixed layer, so it stays perfectly still as
// the page scrolls (moving the real covers to cancel out the scroll always lags a frame and jitters).
// Clicking a copy clicks the real cover. For the flight onto the shelf, the copies hide and the real
// covers (anything marked data-dock) take over, starting from exactly where the copies were.
const SCALE = 0.36; // docked size, relative to the cover on the shelf
const GAP = 14; // space between docked covers, px
const BOTTOM = 22; // docked row's distance from the bottom of the screen, px
const WAKE = 40; // how far you scroll before the dock shows up, px

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function IssueDock() {
  useEffect(() => {
    const wide = matchMedia("(min-width: 1024px)");
    const covers = [...document.querySelectorAll<HTMLElement>("[data-dock]")];
    if (!covers.length) return;

    // The fixed layer of copies. Each copy is a button that clicks the real cover's link or button.
    const layer = document.createElement("div");
    layer.className = "issue-dock";
    const copies = covers.map((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "issue-dock-cover";
      btn.setAttribute("aria-label", c.querySelector('img[alt]:not([alt=""])')?.getAttribute("alt")?.replace(/ logo$/, "") ?? "Open issue");
      const art = c.firstElementChild!.cloneNode(true) as HTMLElement;
      art.querySelectorAll("dialog, [id]").forEach((el) => (el.tagName === "DIALOG" ? el.remove() : el.removeAttribute("id")));
      art.setAttribute("aria-hidden", "true");
      art.inert = true;
      btn.append(art);
      btn.addEventListener("click", () => c.querySelector<HTMLElement>("a[href], button")?.click());
      layer.append(btn);
      return btn;
    });

    // Where each cover sits on the shelf, in page coordinates, measured with no transform applied.
    let slots: { x: number; y: number; w: number; h: number }[] = [];
    let docks: { x: number; y: number }[] = [];
    let vh = 0;
    let frame = 0;
    let active = false;

    const measure = () => {
      covers.forEach((c) => (c.style.transform = ""));
      const vw = document.documentElement.clientWidth;
      vh = innerHeight;
      slots = covers.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
      });
      // Dock spots, in screen coordinates. These don't change with scroll.
      const total = slots.reduce((s, r) => s + r.w * SCALE, 0) + GAP * (slots.length - 1);
      let x = vw / 2 - total / 2;
      docks = slots.map((s) => {
        const d = { x, y: vh - BOTTOM - s.h * SCALE };
        x += s.w * SCALE + GAP;
        return d;
      });
      copies.forEach((b, i) => {
        b.style.width = `${slots[i].w}px`;
        b.style.height = `${slots[i].h}px`;
        b.style.transform = `translate(${docks[i].x}px, ${docks[i].y}px) scale(${SCALE})`;
      });
    };

    const update = () => {
      frame = 0;
      const y = scrollY;
      // 0 = in the dock, 1 = back on the shelf. The flight starts as the shelf comes up from the bottom
      // of the screen and ends when it's a bit above the middle.
      const e = ease(Math.min(1, Math.max(0, (vh - (slots[0].y - y)) / (vh * 0.55))));
      const docked = e === 0;

      layer.toggleAttribute("data-show", docked && y >= WAKE);
      covers.forEach((c, i) => {
        const s = slots[i];
        const k = 1 - e;
        c.style.transform =
          e === 1 ? "" : `translate3d(${((docks[i].x - s.x) * k).toFixed(1)}px, ${((docks[i].y - (s.y - y)) * k).toFixed(1)}px, 0) scale(${(SCALE + (1 - SCALE) * e).toFixed(4)})`;
        c.toggleAttribute("data-docked", e < 1);
        // While the copies are showing, the real covers stay hidden so there's only ever one of each.
        c.toggleAttribute("data-dock-hidden", docked);
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
      document.body.append(layer);
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
      layer.remove();
      covers.forEach((c) => {
        c.style.transform = "";
        c.removeAttribute("data-docked");
        c.removeAttribute("data-dock-hidden");
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
