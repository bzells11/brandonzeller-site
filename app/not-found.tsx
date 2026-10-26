import Link from "next/link";
import { Container, Kicker, buttonStyles } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center">
      <Container>
        <Kicker className="border-t-[3px] border-ink pt-2">p.404 · Page not found</Kicker>
        <h1 className="mt-8 text-mega font-bold italic">Misprint.</h1>
        <p className="mt-6 max-w-md text-body text-muted">That link is broken or the page moved.</p>
        <Link href="/" className={`${buttonStyles.primary} mt-8`}>
          Back to the cover
        </Link>
      </Container>
    </main>
  );
}
