import Link from "next/link";
import { site } from "@/content/site";
import { contents } from "./contents";
import { MobileMenu } from "./MobileMenu";
import { Container } from "./ui";

const links = [contents.feature, contents.work, contents.masthead, contents.contact];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-paper">
      <Container className="flex h-12 items-center justify-between gap-4">
        <a href="#top" aria-label="Back to top" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold tracking-tight">ZELLER</span>
          <span className="font-sans text-kicker font-semibold uppercase text-muted">No. {site.issue.number}</span>
        </a>
        <nav aria-label="Primary" className="font-sans text-sm font-medium">
          <ul className="flex items-center gap-4 md:gap-5">
            {links.map((l) => (
              <li key={l.id} className="hidden md:block">
                <a href={`#${l.id}`} className="marker inline-block">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/resume" className="border border-ink px-3 py-1.5 transition-colors hover:bg-marker">
                Resume
              </Link>
            </li>
            <li className="md:hidden">
              <MobileMenu />
            </li>
          </ul>
        </nav>
      </Container>
      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 -bottom-px h-[3px] bg-marker" />
    </header>
  );
}
