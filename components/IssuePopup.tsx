"use client";

import { useRef } from "react";
import type { Project } from "@/content/site";
import { ArrowUpRight, Kicker, buttonStyles } from "./ui";

// "Learn more" on a back-issue cover: opens that project's write-up in a popup over the shelf.
export function IssuePopup({ project: p }: { project: Project }) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        // Stretches over the whole cover, so clicking anywhere on it opens the popup.
        className="marker inline-flex cursor-pointer items-center gap-0.5 uppercase after:absolute after:inset-0"
      >
        Learn more
      </button>
      <dialog
        ref={ref}
        aria-label={p.name}
        // Clicking the dimmed backdrop (the dialog element itself, outside the panel) closes it.
        onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
        className="m-auto w-[min(40rem,calc(100%-2rem))] max-h-[calc(100dvh-2rem)] border border-ink bg-paper p-0 text-left font-normal text-ink normal-case tracking-normal shadow-[0_30px_60px_-20px_oklch(0.2_0.02_60/0.6)] backdrop:bg-[oklch(0.2_0.012_60/0.55)]"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-baseline justify-between border-b-[3px] border-ink pb-2">
            <Kicker>From the archive</Kicker>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="-mr-2 cursor-pointer px-2 font-sans text-2xl leading-none"
            >
              &times;
            </button>
          </div>
          {p.logo && (
            <div className="mt-6 flex aspect-[16/7] items-center justify-center rounded-[5px] bg-[oklch(0.93_0.025_82)] p-6 ring-1 ring-rule">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.logo}
                alt={`${p.name} logo`}
                className="max-h-full w-[70%] object-contain mix-blend-multiply contrast-[0.9] saturate-[0.45] sepia-[0.3]"
              />
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h4 className="font-display text-4xl leading-none font-bold">{p.name}</h4>
            <Kicker>
              <span className="rounded-[4px] border border-ink px-1.5 py-0.5">{p.status}</span>
            </Kicker>
          </div>
          {p.note && <p className="mt-2 font-sans text-sm font-medium text-muted">{p.note}</p>}
          <p className="mt-4 font-serif text-body">{p.description}</p>
          {p.tags.length > 0 && <p className="mt-4 font-sans text-sm font-medium text-muted">Built with {p.tags.join(" · ")}</p>}
          {p.href && (
            <a href={p.href} target="_blank" rel="noopener noreferrer" className={`${buttonStyles.primary} mt-6`}>
              Try the demo <ArrowUpRight />
            </a>
          )}
        </div>
      </dialog>
    </>
  );
}
