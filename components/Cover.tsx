import Link from "next/link";
import { preload } from "react-dom";
import { site } from "@/content/site";
import { contents } from "./contents";
import { CoverTilt } from "./CoverTilt";
import { ArrowUpRight, Barcode, Container, Kicker } from "./ui";

const srcSet = "/headshot-480.webp 480w, /headshot-640.webp 640w, /headshot-960.webp 960w";
const sizes = "(min-width: 1024px) 31rem, 92vw";

// Opening spread: the contents page on the left, the cover on the right.
export function Cover() {
  preload("/headshot-960.webp", {
    as: "image",
    imageSrcSet: srcSet,
    imageSizes: sizes,
    fetchPriority: "high",
  });

  return (
    <header className="overflow-x-clip border-b border-ink">
      <Container className="grid gap-12 py-8 sm:py-12 lg:grid-cols-2 lg:gap-0 lg:py-16">
        <div className="lg:order-2 lg:pl-14">
          <CoverPage />
        </div>
        <div className="lg:order-1 lg:border-r lg:border-rule lg:pr-14">
          <ContentsPage />
        </div>
      </Container>
    </header>
  );
}

function CoverPage() {
  const feature = site.projects[0];
  return (
    <div className="anim-cover mx-auto max-w-[31rem] [--tilt:0deg] lg:[--tilt:2.5deg]">
      <CoverTilt>
        <div className="cover-tilt group/cover @container relative bg-paper shadow-[0_2px_0_var(--color-ink),0_30px_60px_-30px_oklch(0.2_0.02_60/0.55)] ring-1 ring-ink">
          {/* Masthead */}
          <div className="px-[4cqw] pt-[3cqw]">
            <div className="flex justify-between font-sans text-[2.8cqw] font-semibold uppercase tracking-[0.1em]">
              <span>No. {site.issue.number}</span>
              <span>{site.issue.season}</span>
              <span>{site.hero.location}</span>
            </div>
            <h1 className="mt-[1cqw] text-center font-display text-[24cqw] leading-[0.82] font-bold tracking-[-0.04em]">
              <span className="sr-only">{site.name}</span>
              <span aria-hidden="true">
                {/* Each letter stamps down in turn, like type hitting the page. */}
                {"ZELLER".split("").map((ch, i) => (
                  <span key={i} className="anim-stamp inline-block" style={{ animationDelay: `${300 + i * 70}ms` }}>
                    {ch}
                  </span>
                ))}
              </span>
            </h1>
            <p className="mt-[1.5cqw] border-y border-ink py-[1cqw] text-center font-sans text-[2.9cqw] font-semibold uppercase tracking-[0.25em]">
              The founder issue
            </p>
          </div>

          {/* Photo with cover lines */}
          <div className="relative mt-[3cqw] aspect-[800/860] overflow-hidden">
            {/* Plain img so the browser picks the right size from srcSet (the static export can't resize images). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/headshot-960.webp"
              srcSet={srcSet}
              sizes={sizes}
              alt={site.headshot.alt}
              width={site.headshot.width}
              height={site.headshot.height}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-[50%_20%]"
            />

            <a
              href={`#${contents.feature.id}`}
              className="absolute bottom-[21cqw] left-[4cqw] max-w-[44cqw] bg-paper p-[2.5cqw] transition-transform duration-500 ease-easy hover:-translate-y-1"
            >
              <span className="block font-display text-[6.5cqw] leading-none font-bold italic">
                {feature.name}
              </span>
              <span className="mt-[1cqw] block font-sans text-[3.3cqw] leading-snug font-semibold">
                The app that finds the shortest urgent-care wait.{" "}
                <span className="tabular-nums">p.{contents.feature.page}</span>
              </span>
            </a>

            <a
              href={`#${contents.work.id}`}
              className="absolute bottom-[4cqw] left-[4cqw] max-w-[54cqw] bg-ink p-[2.5cqw] text-paper transition-transform duration-500 ease-easy hover:-translate-y-1"
            >
              <span className="block font-sans text-[3.1cqw] leading-snug font-bold uppercase tracking-wide">
                Five jobs,{" "}
                <span className="whitespace-nowrap">
                  real experience <span className="tabular-nums">p.{contents.work.page}</span>
                </span>
              </span>
            </a>

            <Sticker label={feature.status} />

            <div className="absolute right-[4cqw] bottom-[4cqw] flex w-[27cqw] flex-col items-center bg-paper px-[2cqw] pt-[2cqw] pb-[1cqw]">
              <Barcode
                value={site.url.replace("https://", "")}
                className="h-[8cqw] w-full"
              />
              <span className="mt-[0.8cqw] font-sans text-[2.3cqw] font-semibold">
                brandonzeller.co
              </span>
            </div>
          </div>
        </div>
      </CoverTilt>
    </div>
  );
}

// Round "sticker" slapped on the cover. The ring of text slowly turns.
function Sticker({ label }: { label: string }) {
  const ring = `${label} · ${site.projects[0].name} · `.toUpperCase();
  return (
    <div
      aria-hidden="true"
      className="anim-slap absolute top-[4cqw] right-[4cqw] size-[27cqw] rotate-12 transition-[scale,rotate] duration-700 ease-easy group-hover/cover:scale-110 group-hover/cover:rotate-[20deg]"
    >
      <svg viewBox="0 0 100 100" className="size-full">
        <circle cx="50" cy="50" r="49" fill="var(--color-marker)" />
        <g className="anim-spin origin-center">
          <path
            id="sticker-ring"
            d="M50 50 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0"
            fill="none"
          />
          <text
            className="font-sans"
            fontSize="8.4"
            fontWeight="700"
            letterSpacing="1.6"
            fill="var(--color-on-marker)"
          >
            <textPath href="#sticker-ring">{ring}</textPath>
          </text>
        </g>
        <text
          x="50"
          y="49"
          textAnchor="middle"
          className="font-display"
          fontSize="15"
          fontWeight="700"
          fontStyle="italic"
          fill="var(--color-on-marker)"
        >
          New
        </text>
        <text
          x="50"
          y="62"
          textAnchor="middle"
          className="font-sans"
          fontSize="7"
          fontWeight="700"
          letterSpacing="1"
          fill="var(--color-on-marker)"
        >
          APP
        </text>
      </svg>
    </div>
  );
}

function ContentsPage() {
  const entries = [
    contents.intro,
    contents.feature,
    contents.work,
    contents.masthead,
    contents.back,
    contents.contact,
  ];
  return (
    <div className="flex h-full flex-col">
      <Kicker className="anim-rise mb-3 text-muted">Personal Magazine Portfolio</Kicker>
      <div className="anim-rise flex items-baseline justify-between border-b-[3px] border-ink pb-2">
        <p className="font-display text-h2 italic">Contents</p>
        <Kicker className="text-muted">
          No. {site.issue.number} · {site.issue.season}
        </Kicker>
      </div>

      <p className="anim-rise mt-8 max-w-xl text-deck [animation-delay:80ms]">
        <span className="font-semibold">{site.name}</span> is a business student
        at Ohio State&rsquo;s Fisher College of Business and a self-taught
        builder of real products made with AI. This issue covers the app, the
        jobs, and life off the clock.
      </p>

      <nav aria-label="Contents" className="mt-10">
        <ol className="border-t border-ink">
          {entries.map((e, i) => (
            <li
              key={e.id}
              className="anim-rise border-b border-rule"
              style={{ animationDelay: `${180 + i * 70}ms` }}
            >
              <a
                href={`#${e.id}`}
                className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-3 py-3.5 sm:grid-cols-[3.5rem_9rem_1fr_auto]"
              >
                <span className="font-display text-2xl font-bold tabular-nums">
                  {e.page}
                </span>
                <span className="hidden font-sans text-kicker font-semibold tracking-[0.1em] uppercase text-muted sm:block">
                  {e.label}
                </span>
                <span className="marker justify-self-start font-serif text-xl font-medium italic">
                  {e.title}
                </span>
                <ArrowUpRight className="size-4 rotate-90 text-muted transition-transform duration-500 ease-easy group-hover:translate-y-0.5" />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <ul className="anim-rise mt-8 grid grid-cols-2 gap-2.5 font-sans text-sm font-semibold [animation-delay:650ms] sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 lg:mt-auto lg:pt-10 [&_a]:flex [&_a]:h-12 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-md [&_a]:border [&_a]:border-ink sm:[&_a]:inline sm:[&_a]:h-auto sm:[&_a]:border-0">
        <li>
          <a href={`mailto:${site.email}`} className="marker">
            Email
          </a>
        </li>
        <li>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="marker"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="marker"
          >
            GitHub
          </a>
        </li>
        <li>
          <Link href="/resume" className="marker">
            Resume
          </Link>
        </li>
      </ul>
    </div>
  );
}
