import Link from "next/link";
import { site, type Project } from "@/content/site";
import { contents } from "./contents";
import { WaitChart } from "./WaitChart";
import { InView } from "./InView";
import { ArrowUpRight, Barcode, Container, Kicker, MaskTitle, Section, buttonStyles, delay } from "./ui";

export function Intro() {
  const c = contents.intro;
  const [lead, ...rest] = site.about;
  return (
    <Section id={c.id} page={c.page} label={c.label}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <MaskTitle className="text-h1 italic lg:col-span-12">{c.title}.</MaskTitle>
        <div className="reveal lg:col-span-7" style={delay(150)}>
          <p className="drop-cap text-body">{lead}</p>
          {rest.map((p) => (
            <p key={p} className="mt-5 text-body">
              {p}
            </p>
          ))}
        </div>
        <dl className="reveal grid grid-cols-2 gap-x-5 self-start border-t-[3px] border-ink sm:grid-cols-4 lg:col-span-4 lg:col-start-9 lg:grid-cols-1" style={delay(280)}>
          {site.facts.map((f) => (
            <div key={f.label} className="border-b border-rule py-3">
              <dt className="font-sans text-kicker font-semibold tracking-[0.1em] uppercase text-muted">{f.label}</dt>
              <dd className="mt-1 text-lg">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

export function Feature() {
  const c = contents.feature;
  return (
    <Section id={c.id} page={c.page} label={c.label} className="bg-paper-2">
      {site.projects.map((p) => (
        <FeatureStory key={p.id} project={p} />
      ))}
    </Section>
  );
}

function FeatureStory({ project: p }: { project: Project }) {
  return (
    <article>
      <Kicker className="reveal">
        Cover story <span className="mx-2 text-muted">/</span>
        <span className="rounded-[4px] bg-marker px-1.5 py-0.5">{p.status}</span>
      </Kicker>
      <MaskTitle className="mt-5 text-mega font-bold" delay={80}>{p.name}</MaskTitle>
      <p className="reveal mt-6 max-w-3xl font-serif text-deck italic" style={delay(220)}>{p.description}</p>

      <InView className="reveal mt-12 grid gap-12 border-t border-ink pt-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          {p.story?.map((para, i) => (
            <p key={para} className={`text-body ${i === 0 ? "drop-cap" : "mt-5"}`}>
              {para}
            </p>
          ))}
          {p.href && (
            <a href={p.href} target="_blank" rel="noopener noreferrer" className={`${buttonStyles.primary} mt-8`}>
              See {p.name} <ArrowUpRight />
            </a>
          )}
          {p.tags.length > 0 && (
            <div className="mt-10">
              <Kicker className="border-b-[3px] border-ink pb-2">Built with</Kicker>
              <ul className="grid grid-cols-2 gap-x-6 font-sans text-sm sm:grid-cols-3">
                {p.tags.map((t) => (
                  <li key={t} className="border-b border-rule py-2.5 font-medium">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <InView as="figure" className="border border-ink bg-paper p-5 sm:p-6">
            <Kicker>Fig. 1 · Nearest urgent care, by wait</Kicker>
            <div className="mt-5">
              <WaitChart
                rows={[
                  { name: "Clinic A", minutes: 8 },
                  { name: "Clinic B", minutes: 19 },
                  { name: "Clinic C", minutes: 34 },
                  { name: "Clinic D", minutes: 47 },
                ]}
              />
            </div>
            <figcaption className="mt-5 border-t border-rule pt-3 text-base text-muted">
              Illustration of the comparison {p.name} makes. Not live data.
            </figcaption>
          </InView>

        </div>
      </InView>
    </article>
  );
}

export function Work() {
  const c = contents.work;
  return (
    <Section id={c.id} page={c.page} label={c.label}>
      <MaskTitle className="text-h1 italic">{c.title}.</MaskTitle>
      <ol className="mt-12 border-t border-ink">
        {site.experience.map((job, i) => (
          <InView
            as="li"
            key={job.role + job.org}
            className="reveal grid grid-cols-[2rem_1fr] gap-x-3.5 gap-y-2 border-b border-rule py-7 sm:grid-cols-[4rem_1fr] lg:grid-cols-[4rem_5fr_6fr_10rem] lg:gap-x-8"
          >
            <span className="row-span-3 font-display text-4xl leading-none font-bold tabular-nums sm:text-5xl lg:row-span-1">
              {i + 1}
            </span>
            <div>
              <h4 className="font-display text-2xl leading-tight font-semibold">{job.role}</h4>
              <p className="mt-1 font-sans text-sm font-medium">
                {job.org} <span className="text-muted">· {job.location}</span>
              </p>
            </div>
            <p className="text-lg leading-relaxed">{job.summary}</p>
            <p className="font-sans text-kicker font-semibold tracking-[0.1em] uppercase text-muted lg:text-right">{job.dates}</p>
          </InView>
        ))}
      </ol>
    </Section>
  );
}

// Clubs and honors, set like the staff credits on a magazine's masthead page.
export function Masthead() {
  const c = contents.masthead;
  return (
    <Section id={c.id} page={c.page} label={c.label} className="bg-paper-2">
      <div className="mx-auto max-w-4xl text-center">
        <MaskTitle className="text-h1 italic">{c.title}.</MaskTitle>
        <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
          <Credits
            heading="Clubs & leadership"
            items={site.involvement.map((i) => ({
              role: i.role,
              name: i.org,
              note: [i.detail, i.dates].filter(Boolean).join(", "),
            }))}
          />
          <Credits heading="Honors & certifications" items={site.honors.map((h) => ({ role: h.issuer, name: h.name }))} />
        </div>
      </div>
    </Section>
  );
}

function Credits({ heading, items }: { heading: string; items: { role: string; name: string; note?: string }[] }) {
  return (
    <div>
      <h4 className="border-y border-ink py-2 font-sans text-kicker font-semibold tracking-[0.2em] uppercase">{heading}</h4>
      <InView as="ul" className="mt-8 space-y-7">
        {items.map((it, i) => (
          <li key={it.name} className="reveal" style={delay(i * 90)}>
            <p className="font-sans text-kicker font-semibold tracking-[0.1em] uppercase text-muted">{it.role}</p>
            <p className="mt-1.5 font-display text-2xl leading-tight font-semibold">{it.name}</p>
            {it.note && <p className="mt-1 text-base text-muted">{it.note}</p>}
          </li>
        ))}
      </InView>
    </div>
  );
}

export function BackPage() {
  const c = contents.back;
  const { music, fitness } = site.beyond;
  return (
    <Section id={c.id} page={c.page} label={c.label}>
      <div className="grid gap-12 lg:grid-cols-12">
        <MaskTitle className="text-h1 italic lg:col-span-12">{c.title}.</MaskTitle>
        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-12">
          {[music, fitness].map((b, i) => (
            <div key={b.title} className="reveal border-t-[3px] border-ink pt-4" style={delay(150 + i * 120)}>
              <h4 className="font-display text-3xl font-bold">{b.title}</h4>
              <p className="mt-3 text-body">{b.body}</p>
            </div>
          ))}
          {music.embedUrl && (
            <div className="reveal sm:col-span-2" style={delay(400)}>
              <p className="flex items-center gap-2.5 font-sans text-kicker font-semibold uppercase">
                <Vinyl />
                Now playing
              </p>
              <iframe
                src={music.embedUrl}
                title="Now playing"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="mt-3 h-[152px] w-full rounded-xl"
              />
            </div>
          )}
        </div>
      </div>
      <BackIssues />
    </Section>
  );
}

// Small record that spins next to the "Now playing" label.
function Vinyl() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="anim-spin size-5" style={{ animationDuration: "3s" }}>
      <circle cx="10" cy="10" r="9.5" fill="var(--color-ink)" />
      <circle cx="10" cy="10" r="6.5" fill="none" stroke="var(--color-paper)" strokeOpacity="0.25" strokeWidth="0.6" />
      <circle cx="10" cy="10" r="3.4" fill="var(--color-marker)" />
      <circle cx="10" cy="10" r="0.9" fill="var(--color-ink)" />
      <rect x="9.6" y="7" width="0.8" height="1.6" fill="var(--color-ink)" />
    </svg>
  );
}

// Mini covers for every issue. The current one is this site; future ones are placeholders.
function BackIssues() {
  return (
    <div className="mt-16 sm:mt-20">
      <p className="border-b-[3px] border-ink pb-2 font-sans text-kicker font-semibold uppercase">Back issues</p>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:flex sm:gap-6">
        {site.issues.map((iss, i) => (
          <li
            key={iss.number}
            className={`reveal flex aspect-[3/4] flex-col p-3 sm:w-44 ${
              iss.current ? "border border-ink bg-paper-2 shadow-[0_14px_30px_-18px_oklch(0.2_0.02_60/0.6)]" : "border border-dashed border-muted text-muted"
            }`}
            style={delay(i * 120)}
          >
            <div className="flex justify-between font-sans text-[0.625rem] font-semibold uppercase">
              <span>No. {iss.number}</span>
              <span>{iss.season}</span>
            </div>
            <p className="mt-1 text-center font-display text-[2.1rem] leading-none font-bold tracking-tight">ZELLER</p>
            <p className="mt-1 border-y border-current py-0.5 text-center font-sans text-[0.5625rem] font-semibold tracking-[0.2em] uppercase">
              {iss.headline}
            </p>
            <div className="relative my-2 flex-1 overflow-hidden">
              {iss.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={iss.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover object-[50%_20%]" />
              )}
            </div>
            <p className="font-display text-xl leading-tight font-bold italic">{iss.lead}</p>
            <p className="mt-1 font-sans text-[0.625rem] font-semibold uppercase">
              {iss.current ? (
                <span className="rounded-[3px] bg-marker px-1 text-ink">You&rsquo;re reading it</span>
              ) : (
                "In production"
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The back cover: contact, set in reverse.
export function BackCover() {
  const c = contents.contact;
  return (
    <InView as="footer" id={c.id} aria-labelledby={`${c.id}-head`} className="scroll-mt-12 bg-ink text-paper">
      <Container className="py-16 sm:py-24">
        <div className="flex items-baseline justify-between border-t-[3px] border-paper pt-2 font-sans text-kicker font-semibold uppercase">
          <span>
            <span className="mr-3 tabular-nums">p.{c.page}</span>Letters to the editor
          </span>
          <span className="hidden opacity-70 sm:inline">Back cover</span>
        </div>

        <MaskTitle as="h2" className="mt-12 text-mega font-bold">
          <span id={`${c.id}-head`}>{site.contact.heading}</span>
        </MaskTitle>

        <a
          href={`mailto:${site.email}`}
          className="mt-10 inline-block font-serif text-deck break-all italic underline decoration-1 underline-offset-[0.2em] transition-colors duration-500 ease-easy hover:text-marker"
        >
          {site.email}
        </a>

        <ul className="mt-14 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {[
            { label: "LinkedIn", note: "Connect with me", href: site.links.linkedin, external: true },
            { label: "GitHub", note: "See the code", href: site.links.github, external: true },
            { label: "Resume", note: "View or download", href: "/resume", external: false },
          ].map((l, i) => {
            const cls =
              "group flex items-center justify-between gap-4 rounded-lg border border-paper/40 p-5 transition duration-500 ease-easy hover:-translate-y-1 hover:border-marker hover:bg-marker hover:text-ink sm:p-6";
            const inner = (
              <>
                <span>
                  <span className="block font-display text-3xl font-bold sm:text-4xl">{l.label}</span>
                  <span className="mt-1 block font-sans text-sm font-medium opacity-80">{l.note}</span>
                </span>
                <ArrowUpRight className="size-7 shrink-0 transition-transform duration-500 ease-easy group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            );
            return (
              <li key={l.label} className="reveal" style={delay(250 + i * 100)}>
                {l.external ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={l.href} className={cls}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-16 border-t border-paper/30 pt-8">
          <div className="flex items-end justify-between gap-5">
            <div className="font-sans text-xs opacity-70">
              <p>Designed as a magazine issue. Page numbers are for show.</p>
              <p className="mt-1">{site.contact.copyright}</p>
            </div>
            <div className="bg-paper px-3 pt-3 pb-1.5 text-ink">
              <Barcode value={site.url.replace("https://", "")} className="h-8 w-28" />
              <p className="mt-1 text-center font-sans text-[0.625rem] font-medium tracking-wide">No. {site.issue.number}</p>
            </div>
          </div>
        </div>
      </Container>
    </InView>
  );
}
