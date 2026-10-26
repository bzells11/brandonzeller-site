import { Cover } from "@/components/Cover";
import { Nav } from "@/components/Nav";
import { PageTurn } from "@/components/PageTurn";
import { BackCover, BackPage, Feature, Intro, Masthead, Work } from "@/components/Sections";

export default function Home() {
  return (
    <div id="top">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:font-sans focus:text-paper"
      >
        Skip to content
      </a>
      <Nav />
      <Cover />
      <main id="main">
        <Intro />
        <Feature />
        <Work />
        <Masthead />
        <BackPage />
      </main>
      <BackCover />
      <PageTurn />
    </div>
  );
}
