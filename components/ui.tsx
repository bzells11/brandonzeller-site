import type { CSSProperties, ReactNode } from "react";
import { site } from "@/content/site";
import { InView } from "./InView";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-8 ${className}`}>{children}</div>;
}

// Small tracked caps, the magazine "kicker" above a headline.
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-sans text-kicker font-semibold uppercase ${className}`}>{children}</p>;
}

// Page number + section name across the top of each spread, like a printed running head.
export function RunningHead({ page, label, id, read }: { page: string; label: string; id: string; read?: string }) {
  return (
    <div className="relative flex items-baseline justify-between gap-4 pt-2.5 font-sans text-kicker font-semibold uppercase">
      <span aria-hidden="true" className="draw-rule absolute inset-x-0 top-0 h-[3px] bg-ink" />
      <h2 id={id} className="font-sans font-semibold tracking-[inherit]">
        <span className="mr-3 tabular-nums">p.{page}</span>
        {label}
      </h2>
      <span className="text-muted">
        {read && <span>{read}</span>}
        <span className="hidden sm:inline">
          {read && " · "}
          {site.name} · No. {site.issue.number}
        </span>
      </span>
    </div>
  );
}

export function Section({
  id,
  page,
  label,
  read,
  className = "",
  children,
}: {
  id: string;
  page: string;
  label: string;
  read?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <InView as="section" id={id} aria-labelledby={`${id}-head`} className={`py-16 sm:py-24 ${className}`}>
      <Container>
        <RunningHead page={page} label={label} id={`${id}-head`} read={read} />
        <div className="mt-10 sm:mt-14">{children}</div>
      </Container>
    </InView>
  );
}

// Big headline that slides up from behind its baseline when its section scrolls in.
export function MaskTitle({
  as: Tag = "h3",
  className = "",
  delay = 0,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <Tag className={`mask ${className}`}>
      <span style={{ "--d": `${delay}ms` } as CSSProperties}>{children}</span>
    </Tag>
  );
}

// Inline style helper for staggered reveals: <div className="reveal" style={delay(120)}>
export function delay(ms: number) {
  return { "--d": `${ms}ms` } as CSSProperties;
}

// Estimated reading time for a section, like a magazine's "4 min read".
export function readTime(...texts: string[]) {
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  const seconds = Math.max(10, Math.round(((words / 230) * 60) / 10) * 10);
  return seconds >= 60 ? `${Math.round(seconds / 60)} min read` : `${seconds} sec read`;
}

// A printed barcode built from the characters of a string. Decorative.
export function Barcode({ value, className = "" }: { value: string; className?: string }) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (const ch of value) {
    const c = ch.charCodeAt(0);
    for (let i = 0; i < 3; i++) {
      const w = ((c >> i) & 1) + 1;
      bars.push({ x, w });
      x += w + (((c >> (i + 3)) & 1) + 1);
    }
  }
  return (
    <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" aria-hidden="true" className={className}>
      {bars.map((b) => (
        <rect key={b.x} x={b.x} y="0" width={b.w} height="40" fill="currentColor" />
      ))}
    </svg>
  );
}

export function ArrowUpRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M5 11 11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDown({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const buttonBase =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 font-sans text-sm font-semibold transition duration-500 ease-easy";

export const buttonStyles = {
  primary: `${buttonBase} border border-ink bg-ink text-paper hover:bg-marker hover:text-on-marker`,
  secondary: `${buttonBase} border border-ink text-ink hover:bg-marker hover:text-on-marker`,
};
