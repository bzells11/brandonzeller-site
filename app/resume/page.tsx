import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { resume, type ResumeEntry } from "@/content/resume";
import { site } from "@/content/site";
import { InView } from "@/components/InView";
import { ArrowRight, ArrowUpRight, Barcode, Container, buttonStyles } from "@/components/ui";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name}.`,
};

const download = { href: site.resumePath, download: "Brandon_Zeller_Resume.pdf" };

export default function ResumePage() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-ink bg-paper print:hidden">
        <Container className="flex h-14 items-center justify-between gap-4">
          <Link href="/" className="group inline-flex items-center gap-2 font-sans text-sm font-semibold">
            <ArrowRight className="size-4 rotate-180 transition-transform duration-500 ease-easy group-hover:-translate-x-0.5" />
            <span className="marker">
              Back<span className="hidden sm:inline">&nbsp;to the issue</span>
            </span>
          </Link>
          <a {...download} className={`${buttonStyles.primary} h-9 px-4`}>
            <DownloadIcon />
            Download PDF
          </a>
        </Container>
      </header>

      <main>
        <Container className="py-12 sm:py-16">
          {/* Title block */}
          <div className="flex items-baseline justify-between border-t-[3px] border-ink pt-2 font-sans text-kicker font-semibold uppercase">
            <span>
              <span className="mr-3 tabular-nums">p.17</span>Resume
            </span>
            <span className="text-muted">Updated {resume.updated}</span>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="anim-rise lg:col-span-8">
              <h1 className="text-mega font-bold">{site.name}</h1>
              <p className="mt-5 text-deck italic">
                Business Administration at Ohio State&rsquo;s Fisher College of Business, Class of 2030.
              </p>
            </div>
            <div className="anim-rise space-y-4 [animation-delay:100ms] lg:col-span-4 print:hidden">
              <a {...download} className={`${buttonStyles.primary} h-14 w-full text-base`}>
                <DownloadIcon />
                Download the PDF
              </a>
              <div className="grid grid-cols-2 gap-3">
                <a href={`mailto:${site.email}`} className={`${buttonStyles.secondary} w-full`}>
                  Email
                </a>
                <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className={`${buttonStyles.secondary} w-full`}>
                  LinkedIn <ArrowUpRight />
                </a>
              </div>
            </div>
          </div>

          <p className="mt-8 flex flex-wrap gap-x-6 gap-y-1 border-y border-ink py-3 font-sans text-sm font-medium">
            <a href={`mailto:${site.email}`} className="marker">
              {site.email}
            </a>
            <span>{site.hero.location}</span>
            <span className="text-muted">Hometown: Syosset, NY</span>
          </p>

          {/* Body */}
          <Block title="Education">
            {resume.education.map((e) => (
              <Entry key={e.org} entry={e} />
            ))}
          </Block>

          <Block title="Experience">
            {resume.work.map((e) => (
              <Entry key={e.org} entry={e} />
            ))}
          </Block>

          <Block title="Activities & leadership">
            {resume.activities.map((e) => (
              <Entry key={e.org} entry={e} />
            ))}
          </Block>

          <Block title="Additional">
            <dl className="divide-y divide-rule">
              {resume.additional.map((a) => (
                <div key={a.label} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt className="font-sans text-kicker font-semibold uppercase text-muted sm:pt-1.5">{a.label}</dt>
                  <dd className="text-lg">{a.value}</dd>
                </div>
              ))}
            </dl>
          </Block>

          {/* Closing download */}
          <div className="mt-20 flex flex-col gap-6 bg-ink p-6 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-10 print:hidden">
            <div>
              <p className="font-display text-h2 font-bold">Want a copy?</p>
              <p className="mt-2 font-sans text-sm opacity-80">One page, PDF, ready to attach.</p>
            </div>
            <div className="flex items-center gap-6">
              <a
                {...download}
                className="inline-flex h-14 items-center gap-2 rounded-md bg-marker px-6 font-sans text-base font-semibold text-ink transition-transform duration-500 ease-easy hover:-translate-y-0.5"
              >
                <DownloadIcon />
                Download PDF
              </a>
              <div className="hidden bg-paper px-3 pt-3 pb-1.5 text-ink sm:block">
                <Barcode value="resume.pdf" className="h-8 w-24" />
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-16 grid gap-4 lg:mt-20 lg:grid-cols-12 lg:gap-12">
      <h2 className="font-display text-4xl leading-tight italic lg:sticky lg:top-20 lg:col-span-3 lg:self-start lg:border-t-[3px] lg:border-ink lg:pt-5 lg:pr-4 lg:text-[2.5rem]">
        {title}
      </h2>
      <InView className="reveal border-t-[3px] border-ink lg:col-span-9">{children}</InView>
    </section>
  );
}

function Entry({ entry: e }: { entry: ResumeEntry }) {
  return (
    <article className="border-b border-rule py-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h3 className="font-display text-2xl leading-tight font-semibold">{e.org}</h3>
        <p className="shrink-0 font-sans text-kicker font-semibold uppercase text-muted">{e.dates}</p>
      </div>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-lg">
        <span className="italic">{e.title}</span>
        <span className="font-sans text-sm text-muted">· {e.location}</span>
      </p>
      {e.bullets.length > 0 && (
        <ul className="mt-3 space-y-2">
          {e.bullets.map((b) => (
            <li key={b} className="relative pl-6 text-lg leading-relaxed">
              <span aria-hidden="true" className="absolute top-[0.7em] left-0 h-[3px] w-3 bg-ink" />
              {b}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
      <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
